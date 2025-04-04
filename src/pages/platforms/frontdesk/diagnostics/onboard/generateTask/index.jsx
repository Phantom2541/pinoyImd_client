import React, { useState } from "react";
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

import Body from "./list";
import { Services } from "../../../../../../services/fakeDb";

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

  const getIDS = (collections) => collections.map(({ id }) => id);

  const generateTask = async () => {
    const inhouseIDS = getIDS(inhouse);
    const _outsource = getIDS(outsource);
    const department = activePlatform.department;
    const _inhouse = Services.getTemplates(
      inhouseIDS,
      department === "laboratory" ? "LAB" : "RAD"
    );

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
        outsources: outsource,
      })
    );
    localStorage.setItem("ssx", JSON.stringify(ssx));

    const forms = Object.keys(_inhouse);

    const saveRequest = async (url, data) => {
      try {
        await axioKit.save(url, data, token);
      } catch (error) {
        console.error("Error saving request:", error);
      }
    };

    for (const key in _inhouse) {
      const lowercaseKey = key.toLowerCase();

      const requestData = {
        packages: _inhouse[key],
        _id,
        customerId: customerId?._id,
        branchId: activePlatform.branchId,
      };

      switch (key) {
        case "Miscellaneous":
          const buntisTests = []; // HIV, RPR, HBsAg, HAV, HCV
          let tests = _inhouse[key];

          const buntisPresent = tests.filter((test) =>
            buntisTests.includes(test)
          );
          if (buntisPresent.length) {
            tests = tests.filter((item) => !buntisTests.includes(item));

            // Save buntisPresent if present
            await saveRequest("/diagnostics/laboratory/result/miscellaneous", {
              packages: buntisPresent,
              saleId: _id,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
              buntis: true,
            });
            console.log("results test", tests);
            return; // Stop further queries if buntisPresent is saved
          }

          // Solo form processing
          const soloForms = tests.map((test) => ({
            packages: [test],
            saleId: _id,
            customerId: customerId?._id,
            branchId: activePlatform.branchId,
            _buntis: false,
          }));

          await saveRequest(
            "/diagnostics/laboratory/result/miscellaneous",
            soloForms
          );
          break;

        case "ECG":
        case "X-ray":
          // Radiology department handling
          await saveRequest(
            `/diagnostics/${department}/result/${lowercaseKey}`,
            requestData
          );
          break;

        case "Examination":
        case "Certificate":
          // Clinic department handling
          await saveRequest(
            `/diagnostics/${department}/result/${lowercaseKey}`,
            requestData
          );
          break;

        default:
          // Default case for other departments
          await saveRequest(
            `/diagnostics/${department}/result/${lowercaseKey}`,
            requestData
          );
          break;
      }
    }

    // Open the printout request form window
    window.open(
      "/printout/request/form",
      "RequestForm", // Window name 1
      "top=100px,left=100px,width=1050px,height=750px"
    );

    if (outSourceId && outsource.length > 0) {
      window.open(
        "/printout/request/outsource",
        "OutsourceRequestForm", // Unique window name 2
        "top=100px,left=0px,width=1050px,height=750px"
      );
      await saveRequest(`/commerce/pos/services/dealOutSources`, {
        dealId: deal._id,
        servicesId: _outsource,
      });
    }

    const data = {
      _id,
      ssx,
      lol: auth._id,
      rendered: [
        {
          department: "LAB",
          renderedBy: auth._id,
          renderedAt: new Date().toLocaleString(),
        },
      ],
      forms,
      ...(outSourceId && { outsource: outSourceId }),
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

          <Body outSource={outSourceId} setOutSource={setOutSourceId} />
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
