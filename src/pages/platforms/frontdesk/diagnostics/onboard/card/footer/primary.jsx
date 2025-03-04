import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";

import { axioKit, harvestTask } from "../../../../../../../services/utilities";
import { generateClaimStub } from "../../../../../../../services/utilities";
import { REFORM } from "../../../../../../../services/redux/slices/commerce/taskGenerator";

const PrimaryFooter = ({ sale, setEdit }) => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const generateTask = async (sale) => {
    localStorage.setItem("claimStub", JSON.stringify(sale));
    const { _id, cart, customerId, ssx } = sale;
    let RequestForm = { customer: sale?.customerId };
    const task = harvestTask(cart);
    const forms = Object.keys(task).length;

    for (const key in task) {
      const lowercaseKey = key.toLowerCase();
      RequestForm[lowercaseKey] = task[key];

      if (key === "Miscellaneous") {
        // const buntisTests = [68, 69, 70, 131, 97]; // HIV, RPR, HBsAg, HAV, HCV
        const buntisTests = []; // HIV, RPR, HBsAg, HAV, HCV //removed 131
        var tests = task[key];
        // Check if all elements to remove are present in the array
        const buntisPresent = tests.filter((test) =>
          buntisTests.includes(test)
        );
        //console.log("Miscellaneous");
        if (!!buntisPresent.length) {
          //console.log("buntisPresent");

          tests = tests.filter((item) => !buntisTests.includes(item));
          await axioKit.save(
            "results/laboratory/miscellaneous",
            {
              packages: buntisPresent,
              saleId: _id,
              customerId: customerId?._id,
              branchId: activePlatform.branchId,
              buntis: true,
            },
            token
          );
          return; // added a return to stop from double query
        }

        // Solo form:
        // 1. Preg test (67),
        // 2. Dengue Duo (77),
        // 3. Blood Typing (66)
        //console.log("single form");

        const newArr = tests.map((test) => ({
          packages: [test],
          saleId: _id,
          customerId: customerId?._id,
          branchId: activePlatform.branchId,
          _buntis: false,
        }));

        axioKit.save("results/laboratory/miscellaneous", newArr, token);

        continue;
      }
      const department =
        key === "ECG" || key === "X-ray"
          ? "radiology"
          : key === "Examination" || key === "Certicifate"
          ? "clinic"
          : "laboratory";

      axioKit.save(
        `results/${department}/${lowercaseKey}`,
        {
          packages: task[key],
          _id,
          customerId: customerId?._id,
          branchId: activePlatform.branchId,
        },
        token
      );

      localStorage.setItem("RequestForm", JSON.stringify(RequestForm));
    }

    // working request form but not showing anything
    window.open(
      "/printout/request/form",
      "Request Form",
      "top=100px,left=100px,width=1050px,height=750px"
    );

    dispatch(
      REFORM({
        token,
        data: {
          _id,
          lol: auth._id,
          renderedBy: auth._id,
          renderedAt: new Date().toLocaleString(),
          forms,
        },
      })
    );
  };

  return (
    <MDBBtnGroup className="sales-card-footer w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="primary"
        title="Edit"
        onClick={() => setEdit(true)}
      >
        <MDBIcon icon="pencil-alt" />
      </MDBBtn>
      <MDBBtn
        type="button"
        onClick={() => generateClaimStub(sale)}
        title="View Claim Stub"
        className="m-0 "
        size="sm"
        color="primary"
      >
        <MDBIcon icon="eye" />
      </MDBBtn>
      <MDBBtn
        type="button"
        onClick={() => generateTask(sale)}
        className="m-0 "
        title="Generate Task"
        size="sm"
        color="primary"
      >
        <MDBIcon icon="user-injured" />
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default PrimaryFooter;
