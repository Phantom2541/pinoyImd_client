import React, { useEffect, useState } from "react";
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
import { axioKit } from "../../../../../../services/utilities";
import CaseBox from "./case";
import { Services } from "../../../../../../services/fakeDb";

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
      outsource,
    } = useSelector(({ taskGenerator }) => taskGenerator),
    { collections } = useSelector(({ providers }) => providers),
    [outSourceId, setOutSourceId] = useState(""),
    dispatch = useDispatch();
  const toggle = () => dispatch(TOGGLE());

  useEffect(() => {
    if (show) setOutSourceId("");
  }, [show]);
  const department = activePlatform.department === "laboratory" ? "LAB" : "RAD";

  const getIDS = (collections) => collections.map(({ id }) => id);
  const saveRequest = async (template, data, isStaticPath = false) => {
    try {
      const _department = ["laboratory", "radiology"].includes(
        activePlatform.department
      )
        ? activePlatform.department
        : "clinic"; // default fallback just in case

      const url = isStaticPath
        ? template
        : `/diagnostics/${_department}/result/${template}`;
      await axioKit.save(url, data, token);
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };
  const generateTask = async () => {
    const inhouseIDS = getIDS(inhouse);
    const _outsource = getIDS(outsource);
    const _inhouse = Services.getTemplatesWithIntKey(inhouseIDS, department);
    const _forms = Services.getTemplates(inhouseIDS, department);
    const { _id, customerId, ssx, forms: oldForms } = deal;
    const sentOut = [...collections].find(
      ({ vendors }) => vendors?._id === outSourceId
    );

    localStorage.setItem(
      "inhouse",
      JSON.stringify({ deal, forms: { ..._forms } })
    );
    localStorage.setItem(
      "outsource_request",
      JSON.stringify({
        deal: { ...deal, ssx },
        sentOut,
        isRad: department === "RAD",
        outsources: outsource,
      })
    );
    localStorage.setItem("ssx", JSON.stringify(ssx));

    const deptIndexMap = {
      LAB: 0,
      RAD: 1,
      CLINIC: 2,
    };

    const deptIndex = deptIndexMap[department];
    const newFormKeys = Object.keys(_inhouse);

    const forms = {
      ...(oldForms || {}),
      [deptIndex]: [
        ...(oldForms?.[deptIndex] || []),
        ...newFormKeys.filter(
          (key) => !(oldForms?.[deptIndex] || []).includes(key)
        ),
      ],
    };

    for (const key in _forms) {
      const lowercaseKey = key.toLowerCase();
      let bucket = _forms[key];
      let requestData = {
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
          bucket.map(
            async (test) =>
              await saveRequest(lowercaseKey, {
                dealId: _id,
                packages: test,
                hasRead: false,
                customerId: customerId?._id,
                branchId: activePlatform.branchId,
              })
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
        "top=100px,left=100px,width=1050px,height=750px"
      );
    }

    const haveOutSource =
      outsource.length > 0 && (outSourceId || department === "RAD");

    if (haveOutSource) {
      window.open(
        "/printout/request/outsource",
        "OutsourceRequestForm",
        "top=100px,left=0px,width=1050px,height=750px"
      );

      if (department !== "RAD") {
        await saveRequest(
          `/commerce/pos/services/dealOutSources`,
          {
            _id: deal._id,
            servicesId: _outsource,
          },
          true
        );
      } else {
        const officialReadingXray = _outsource;
        officialReadingXray.map(
          async (test) =>
            await saveRequest("x-ray", {
              dealId: _id,
              packages: test,
              hasRead: true,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
            })
        );
      }
    }

    const data = {
      _id,
      ssx,
      rendered: [
        {
          department,
          renderedBy: auth._id,
          renderedAt: new Date().toLocaleString(),
        },
      ],
      forms,
      ...(haveOutSource && department !== "RAD" && { outsource: outSourceId }),
    };

    dispatch(
      REFORM({
        token,
        data,
      })
    );
    dispatch(TOGGLE());
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} size="lg" backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <h5>
          <MDBIcon className="mr-2" icon="tasks" />
          Task Generator
        </h5>
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
