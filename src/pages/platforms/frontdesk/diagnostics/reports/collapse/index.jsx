import React from "react";
import {
  MDBContainer,
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBIcon,
} from "mdbreact";
import {
  dateFormat,
  sourceColor,
  axioKit,
  harvestTask,
} from "../../../../../../services/utilities";
import Table from "./table";
import { useHistory } from "react-router";
import { Services } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";

import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

export default function TasksCollapse({
  task,
  number,
  setActiveCollapse,
  isActive,
}) {
  const { _id, category } = task,
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    history = useHistory(),
    dispatch = useDispatch();

  const hasRenderedItems = task.rendered && task.rendered.length !== 0;
  const generateTask = async () => {
    alert("lol ginagawa ko pa wait kalang ");
    console.log("task", task);

    const { _id, cart, customerId, ssx } = task;
    const packages = cart.flatMap((item) => item.packages);

    const template = Services.getTemplates(packages, "LAB");

    let RequestForm = { customer: task?.customerId };
    const task = harvestTask(cart);
    localStorage.setItem("task", JSON.stringify(task));
    localStorage.setItem("ssx", JSON.stringify(ssx));

    const forms = Object.keys(task);
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
            "/diagnostics/laboratory/result/miscellaneous",
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

        axioKit.save(
          "/diagnostics/laboratory/result/miscellaneous",
          newArr,
          token
        );

        continue;
      }
      const department =
        key === "ECG" || key === "X-ray"
          ? "radiology"
          : key === "Examination" || key === "Certicifate"
          ? "clinic"
          : "laboratory";

      axioKit.save(
        `/diagnostics/${department}/result/${lowercaseKey}`,
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
        },
      })
    );
  };
  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      <MDBCard>
        <MDBCollapseHeader
          onClick={() => hasRenderedItems && setActiveCollapse(_id)}
          className="d-flex align-items-center justify-content-between"
        >
          <span>
            {number}.{dateFormat(task?.createdAt)}
          </span>

          <span>
            <MDBBadge color={sourceColor(category)} className="mx-2">
              {category}
            </MDBBadge>
            {!hasRenderedItems && (
              <MDBBadge
                onClick={() => generateTask()}
                color="info"
                className="px-2 cursor-pointer"
              >
                <MDBIcon icon="sync-alt" />
              </MDBBadge>
            )}
            {task.source && (
              <MDBBadge color="warning">{task?.source?.name}</MDBBadge>
            )}
            xxxx
            {hasRenderedItems && (
              <i
                style={{ transform: `rotate(${isActive ? 0 : 90}deg)` }}
                className="fa fa-angle-down transition-all ml-2"
              />
            )}
          </span>
        </MDBCollapseHeader>
        {hasRenderedItems && (
          <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
            <MDBCardBody className="pt-0">
              <Table menu={task} />
            </MDBCardBody>
          </MDBCollapse>
        )}
      </MDBCard>
    </MDBContainer>
  );
}
