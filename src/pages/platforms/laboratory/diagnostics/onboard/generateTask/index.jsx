import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  REFORM,
  TOGGLE,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { axioKit, fullName } from "../../../../../../services/utilities";
import CaseBox from "./case";
import { Services } from "../../../../../../services/fakeDb";
// import MachineSender from "./machines";

/**
 * Common for Buntis and Blood Donors
 * HIV:68, RPR:69, HBsAg:70,  HCV:97
 */
const panel = [68, 69, 70, 97];
export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    {
      show,
      selected: deal,
      inhouse,
      cluster,
    } = useSelector(({ taskGenerator }) => taskGenerator),
    // { collections } = useSelector(({ providers }) => providers),
    [outSourceId, setOutSourceId] = useState(""),
    dispatch = useDispatch();

  const toggle = () => {
    dispatch(TOGGLE());
  };

  useEffect(() => {
    if (show) setOutSourceId("");
  }, [show]);
  const department = activePlatform.department === "Laboratory" ? "LAB" : "RAD";

  const getIDS = (collections) => collections.map(({ id }) => id);
  const saveRequest = async (template, data, isStaticPath = false) => {
    try {
      const _department = ["Laboratory", "Radiology"].includes(
        activePlatform.department
      )
        ? activePlatform.department
        : "clinic"; // default fallback just in case
      const url = isStaticPath
        ? template
        : `/diagnostics/${_department.toLowerCase()}/result/${template.replace(
            /\s+/g,
            ""
          )}`;
      await axioKit.save(url, data, token);
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };

  const generateTask = async () => {
    const inhouseIDS = getIDS(inhouse);
    const _inhouse = Services.getTemplatesWithIntKey(inhouseIDS, department);
    const _forms = Services.getTemplates(inhouseIDS, department);
    const { _id, customerId, ssx, forms: oldForms, pn } = deal;
    // const sentOut = [...collections].find(
    //   ({ vendors }) => vendors?._id === outSourceId
    // );

    localStorage.setItem(
      "inhouse",
      JSON.stringify({ deal, forms: { ..._forms }, isResult: false })
    );
    // localStorage.setItem(
    //   "outsource_request",
    //   JSON.stringify({
    //     deal: { ...deal, ssx },
    //     sentOut,
    //     isRad: department === "RAD",
    //     outsources: outsource,
    //   })
    // );
    // localStorage.setItem("ssx", JSON.stringify(ssx));

    const deptIndexMap = {
      LAB: 0,
      RAD: 1,
      CLINIC: 2,
    };

    const deptIndex = deptIndexMap[department];
    const newFormKeys = Object.keys(_inhouse).map(Number);

    const forms = {
      ...(oldForms || {}),
      [deptIndex]: [
        ...new Set(
          [...(oldForms?.[deptIndex] || []), ...newFormKeys].map(Number)
        ),
      ],
    };

    for (const key in _forms) {
      const lowercaseKey = key.toLowerCase();
      let bucket = _forms[key];
      let requestData = {
        pn,
        _id,
        packages: bucket,
        customerId: customerId?._id,
        branchId: activePlatform.branchId,
        hasRead: false,
      };
      switch (key) {
        case "Miscellaneous":
          const panelAvail = bucket.filter((test) => panel.includes(test));
          if (panelAvail.length) {
            bucket = bucket.filter((item) => !panel.includes(item));
            await saveRequest(lowercaseKey, {
              dealId: _id,
              pn,
              packages: panelAvail,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
              buntis: true,
            });
          }
          if (bucket.length > 0) {
            bucket.map(
              async (test) =>
                await saveRequest(lowercaseKey, {
                  dealId: _id,
                  pn,
                  packages: [test],
                  customerId: customerId?._id,
                  branchId: activePlatform.branchId,
                  _buntis: false,
                })
            );
          }
          break;
        case "Ultrasound":
        case "Xray":
          await Promise.all(
            bucket.map((test) =>
              saveRequest(lowercaseKey, {
                pn,
                dealId: _id,
                packages: test,
                hasRead: false,
                customerId: customerId?._id,
                branchId: activePlatform.branchId,
              })
            )
          );
          break;
        case "ECG":
          requestData.packages = bucket[0];
          await saveRequest(lowercaseKey, requestData);
          break;
        default:
          await saveRequest(lowercaseKey, requestData);
      }
    }

    if (inhouse.length > 0) {
      window.open(
        "/printout/request/form",
        "RequestForm",
        "top=100px,left=100px,width=400px,height=750px"
      );
    }

    const haveOutSource = Object.keys(cluster).length > 0;

    if (haveOutSource) {
      for (const [key, value] of Object.entries(cluster)) {
        if (department !== "RAD") {
          await saveRequest(
            `/commerce/pos/services/onboardings`,
            {
              vendor: key,
              pid: customerId?._id,
              client: activePlatform.branchId,
              services: getIDS(value),
            },
            true
          );
        } else {
          for (const test of getIDS(value)) {
            await saveRequest("x-ray", {
              dealId: _id,
              packages: test,
              hasRead: true,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
            });
          }
        }
      }
    }

    const data = {
      _id,
      ssx,
      status: "onProcess",
      rendered: [
        ...deal.rendered,
        {
          dept: department,
          by: auth._id,
          at: new Date().toISOString(),
        },
      ],
      forms,
    };

    dispatch(
      REFORM({
        token,
        data,
      })
    );
    dispatch(TOGGLE());

    // MachineSender(_forms,deal)
  };

  return (
    <MDBModal isOpen={show} backdrop toggle={toggle} size="lg">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon className="mr-2" icon="tasks" />
        {fullName(deal?.customerId?.fullName)} <br />
        <h6
          style={{
            fontWeight: 400,
            marginTop: "-0px",
            marginBottom: "-0.5rem",
            marginLeft: "2.1rem",
          }}
        >
          Task Generator
        </h6>
      </MDBModalHeader>
      <form>
        <MDBModalBody className="mb-0">
          <MDBTypography noteTitle="Description: " note noteColor="warning">
            Drag and drop tasks between 'Inhouse' and 'Outsource' for easy
            management.
          </MDBTypography>
          <CaseBox outSource={outSourceId} setOutSource={setOutSourceId} />
          <MDBBtn
            className="float-right mt-3 mb-3"
            color="primary"
            onClick={generateTask}
          >
            Generate
          </MDBBtn>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}
