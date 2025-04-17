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
  TOGGLE,
  REFORM,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { axioKit } from "../../../../../../services/utilities";
import CaseBox from "./case";
import { Services } from "../../../../../../services/fakeDb";

/**
 * Common for Buntis and Blood Donors
 * HIV, RPR, HBsAg,  HCV
 */
const panel = [68, 69, 70, 97];
export default function Modal() {
  const { auth, token, activePlatform } = useSelector(({ auth }) => auth),
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
    console.log("inHouseIds",inhouseIDS );
    
    const _outsource = getIDS(outsource);
    const _inhouse = Services.getTemplates(inhouseIDS, department);

    const { _id, customerId, ssx } = deal;
    //sent out company
    const sentOut = [...collections].find(
      ({ vendors }) => vendors?._id === outSourceId
    );
    localStorage.setItem(
      "inhouse",
      JSON.stringify({ deal, forms: { ..._inhouse } })
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
    const forms = Object.keys(_inhouse);
    for (const key in _inhouse) {
      const lowercaseKey = key.toLowerCase();
      let bucket = _inhouse[key];
      const requestData = {
        _id,
        packages: bucket,
        customerId: customerId?._id,
        branchId: activePlatform.branchId,
      };

      switch (key) {
        case "Miscellaneous":
          const panelAvail = bucket.filter((test) => panel.includes(test));
          if (panelAvail.length) {
            bucket = bucket.filter((item) => !panel.includes(item));
            await saveRequest(lowercaseKey, {
              packages: panelAvail,
              dealId: _id,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
              buntis: true,
            });
            return; // Stop further queries if panel is saved
          }

          // Solo form processing
          const soloForms = bucket.map((test) => ({
            packages: [test],
            dealId: _id,
            customerId: customerId?._id,
            branchId: activePlatform.branchId,
            _buntis: false,
          }));

          await saveRequest(lowercaseKey, soloForms);
          break;
        case "X-ray":
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
        default:
          /**
           * Single results in every transactions
           * 1. Chemistr
           * 2. Urinalysis
           * 3. Hematology
           * 4. Parasitology
           * 5. Coagulation
           * 6. Serology
           * 7. ECG
           * 8. Ultrasound
           * 9. 2DEcho
           * 10. certificate
           * 11. Examination
           * 12. Bacteriology
           * 13. Biopsy
           * 14. PAPs
           * 15. PBS
           * 16. compatibility
           * 17. Drugtest
           */
          await saveRequest(lowercaseKey, requestData);
      }
    }

    // // Open the printout request form window
    // if (inhouse.length > 0) {
    //   window.open(
    //     "/printout/request/form",
    //     "RequestForm", // Window name 1
    //     "top=100px,left=100px,width=1050px,height=750px"
    //   );
    // }

    const haveOutSource =
      outsource.length > 0 && (outSourceId || department === "RAD");

    if (haveOutSource) {
      // have cluster
      window.open(
        "/printout/request/outsource",
        "OutsourceRequestForm", // Unique window name 2
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

    // dispatch(
    //   REFORM({
    //     token,
    //     data,
    //   })
    // );
    // dispatch(TOGGLE());
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
