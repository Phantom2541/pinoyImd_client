import React from "react";
import { MDBCollapseHeader, MDBBadge, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  axioKit,
  dateFormat,
  sourceColor,
  harvestTask,
} from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

export default function TaskHeader({
  task,
  number,
  setActiveCollapse,
  isActive,
}) {
  const { _id, category, source, cart, customerId, ssx } = task;
  const hasRenderedItems = task.rendered && task.rendered.length !== 0;

  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const generateTask = async () => {
    alert("Processing task generation...");
    console.log("Task Data:", task);

    const packages = cart.flatMap((item) => item.packages);
    // const template = Services.getTemplates(packages, "LAB");

    let requestForm = { customer: customerId };
    const harvestedTask = harvestTask(cart);
    localStorage.setItem("task", JSON.stringify(harvestedTask));
    localStorage.setItem("ssx", JSON.stringify(ssx));

    const forms = Object.keys(harvestedTask);
    for (const key in harvestedTask) {
      const lowercaseKey = key.toLowerCase();
      requestForm[lowercaseKey] = harvestedTask[key];

      const department =
        key === "ECG" || key === "X-ray"
          ? "radiology"
          : key === "Examination" || key === "Certicifate"
          ? "clinic"
          : "laboratory";

      axioKit.save(
        `/diagnostics/${department}/result/${lowercaseKey}`,
        {
          packages: harvestedTask[key],
          _id,
          customerId: customerId?._id,
          branchId: activePlatform.branchId,
        },
        token
      );

      localStorage.setItem("RequestForm", JSON.stringify(requestForm));
    }

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
    <MDBCollapseHeader
      onClick={() => hasRenderedItems && setActiveCollapse(_id)}
      className="d-flex align-items-center justify-content-between"
    >
      <span>
        {number}. {dateFormat(task?.createdAt)}
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
        {source && <MDBBadge color="warning">{source?.name}</MDBBadge>}
        {hasRenderedItems && (
          <i
            style={{ transform: `rotate(${isActive ? 0 : 90}deg)` }}
            className="fa fa-angle-down transition-all ml-2"
          />
        )}
      </span>
    </MDBCollapseHeader>
  );
}
