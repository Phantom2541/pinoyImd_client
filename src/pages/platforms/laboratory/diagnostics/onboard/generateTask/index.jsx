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
    { collections } = useSelector(({ providers }) => providers),
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

  const formattedData = (datas) => {
    const inhouseIDS = getIDS(datas);
    const templateKey = Services.getTemplatesWithIntKey(inhouseIDS, department);
    const forms = Services.getTemplates(inhouseIDS, department);
    return { templateKey, forms };
  };

  const arrangeForms = (oldForms = {}, templateKey = []) => {
    const deptIndexMap = {
      LAB: 0,
      RAD: 1,
      CLINIC: 2,
    };

    const deptIndex = deptIndexMap[department];
    const newFormKeys = Object.keys(templateKey).map(Number);

    return {
      ...(oldForms || {}),
      [deptIndex]: [
        ...new Set(
          [...(oldForms?.[deptIndex] || []), ...newFormKeys].map(Number)
        ),
      ],
    };
  };

  const getSendoutBy = (tests) => {
    const sendout = Object.keys(cluster).find((key) => {
      return (
        cluster[key].length === tests.length &&
        cluster[key].every((val) => tests.includes(val.id))
      );
    });
    return sendout;
  };

  const generateTask = async () => {
    const { templateKey: _inhouse, forms: _forms } = formattedData(inhouse);
    const { templateKey: _cluster, forms: clusterForms } = formattedData(
      Object.values(cluster).flat()
    );

    const {
      _id,
      customerId,
      ssx,
      forms: oldForms,
      pn,
      soForms: oldSOForms,
    } = deal;

    localStorage.setItem(
      "inhouse",
      JSON.stringify({ deal, forms: { ..._forms }, isResult: false })
    );
    const saveTests = async (tests, isSendout = false) => {
      for (const key in tests) {
        const lowercaseKey = key.toLowerCase();
        let bucket = tests[key];
        let requestData = {
          pn,
          _id,
          packages: bucket,
          customerId: customerId?._id,
          branchId: activePlatform.branchId,
          hasRead: false,
          ...(isSendout && { soBy: getSendoutBy(bucket) }),
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
    };

    const forms = arrangeForms(oldForms, _inhouse);
    const soForms = arrangeForms(oldSOForms, _cluster); //sendout forms
    await saveTests(_forms, false);

    if (inhouse.length > 0) {
      window.open(
        "/printout/request/form",
        "RequestForm",
        "top=100px,left=100px,width=400px,height=750px"
      );
    }

    const haveOutSource = Object.keys(cluster).length > 0;

    if (haveOutSource) {
      await saveTests(clusterForms, true);
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
      rendered: [
        ...(deal.rendered || []),
        {
          dept: department,
          by: auth._id,
          at: new Date().toLocaleString(),
        },
      ],
      forms,
      soForms,
    };

    dispatch(
      REFORM({
        token,
        data,
      })
    );
    dispatch(TOGGLE());

    // MachineSender(_forms, deal);
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
