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

import { axioKit, harvestTask } from "../../../../../../services/utilities";

import Body from "./list";

export default function Modal() {
  const { auth, token, activePlatform } = useSelector(({ auth }) => auth),
    {
      show,
      selected: deal,
      inhouse,
      outsource,
    } = useSelector(({ taskGenerator }) => taskGenerator),
    [outSource, setOutSource] = useState(""),
    dispatch = useDispatch();
  const toggle = () => dispatch(TOGGLE());

  const getIDS = (collections) => collections.map(({ id }) => id);
  const generateTask = async () => {
    const inhouseIDS = getIDS(inhouse);
    const outsourceIDS = getIDS(outsource);
    console.log("inhouseIDS", inhouseIDS);
    console.log("outsourceIDS", outsourceIDS);

    // const { _id, cart, customerId, ssx } = deal;
    // let RequestForm = { customer: deal?.customerId };
    // const task = harvestTask(cart);
    // localStorage.setItem("task", JSON.stringify(task));
    // localStorage.setItem("ssx", JSON.stringify(ssx));

    // const forms = Object.keys(task);
    // for (const key in task) {
    //   const lowercaseKey = key.toLowerCase();
    //   RequestForm[lowercaseKey] = task[key];

    //   if (key === "Miscellaneous") {
    //     // const buntisTests = [68, 69, 70, 131, 97]; // HIV, RPR, HBsAg, HAV, HCV
    //     const buntisTests = []; // HIV, RPR, HBsAg, HAV, HCV //removed 131
    //     var tests = task[key];
    //     // Check if all elements to remove are present in the array
    //     const buntisPresent = tests.filter((test) =>
    //       buntisTests.includes(test)
    //     );
    //     //console.log("Miscellaneous");
    //     if (!!buntisPresent.length) {
    //       //console.log("buntisPresent");

    //       tests = tests.filter((item) => !buntisTests.includes(item));
    //       await axioKit.save(
    //         "/diagnostics/laboratory/result/miscellaneous",
    //         {
    //           packages: buntisPresent,
    //           saleId: _id,
    //           customerId: customerId?._id,
    //           branchId: activePlatform.branchId,
    //           buntis: true,
    //         },
    //         token
    //       );
    //       return; // added a return to stop from double query
    //     }

    //     // Solo form:
    //     // 1. Preg test (67),
    //     // 2. Dengue Duo (77),
    //     // 3. Blood Typing (66)
    //     //console.log("single form");

    //     const newArr = tests.map((test) => ({
    //       packages: [test],
    //       saleId: _id,
    //       customerId: customerId?._id,
    //       branchId: activePlatform.branchId,
    //       _buntis: false,
    //     }));

    //     axioKit.save(
    //       "/diagnostics/laboratory/result/miscellaneous",
    //       newArr,
    //       token
    //     );

    //     continue;
    //   }
    //   const department =
    //     key === "ECG" || key === "X-ray"
    //       ? "radiology"
    //       : key === "Examination" || key === "Certicifate"
    //       ? "clinic"
    //       : "laboratory";

    //   axioKit.save(
    //     `/diagnostics/${department}/result/${lowercaseKey}`,
    //     {
    //       packages: task[key],
    //       _id,
    //       customerId: customerId?._id,
    //       branchId: activePlatform.branchId,
    //     },
    //     token
    //   );

    //   localStorage.setItem("RequestForm", JSON.stringify(RequestForm));
    // }

    // // working request form but not showing anything
    // window.open(
    //   "/printout/request/form",
    //   "Request Form",
    //   "top=100px,left=100px,width=1050px,height=750px"
    // );

    // dispatch(
    //   REFORM({
    //     token,
    //     data: {
    //       _id,
    //       ssx,
    //       lol: auth._id,
    //       rendered: [
    //         {
    //           department: "LAB",
    //           renderedBy: auth._id,
    //           renderedAt: new Date().toLocaleString(),
    //         },
    //       ],
    //       forms,
    //     },
    //   })
    // );
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

          <Body outSource={outSource} setOutSource={setOutSource} />
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
