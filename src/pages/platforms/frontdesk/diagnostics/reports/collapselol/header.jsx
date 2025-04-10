import React from "react";
import { MDBCollapseHeader, MDBBadge, MDBBtn } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  axioKit,
  dateFormat,
  sourceColor,
  harvestTask,
  collapse,
} from "../../../../../../services/utilities";
// import { Services } from "../../../../../../services/fakeDb";
import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

export default function TaskHeader({
  task,
  number,
  didHoverID,
  setDidHoverID,
  setActiveCollapse,
  isActive,
  activeCollapse,
}) {
  const { _id, category, source, cart, customerId, ssx } = task;

  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const generateTask = async () => {
    // const packages = cart.flatMap((item) => item.packages);
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

  const { color, border } = collapse.getStyle(
    String(_id),
    String(activeCollapse),
    String(didHoverID)
  );
  return (
    <MDBCollapseHeader
      onMouseLeave={() => setDidHoverID(-1)}
      onMouseEnter={() => setDidHoverID(_id)}
      className={`${border} ${color}`}
      style={{ cursor: "default" }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span>
            {number}. {dateFormat(task?.createdAt)}
          </span>
          <span>
            <MDBBadge
              color={sourceColor(category)}
              className="mx-2"
              style={{ fontSize: "0.7rem" }}
            >
              {category}
            </MDBBadge>

            {source && <MDBBadge color="warning">{source?.name}</MDBBadge>}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <MDBBtn
            size="sm"
            color="white"
            rounded
            onClick={() =>
              setActiveCollapse((prev) => (prev === _id ? "" : _id))
            }
            className="m-0 p-0 transition-all "
            style={{ width: isActive ? "1.5rem" : "2rem", height: "1.4rem" }}
          >
            <i
              style={{ rotate: `${isActive ? 0 : 90}deg` }}
              className="fa fa-angle-down transition-all "
            />
          </MDBBtn>
        </div>
      </div>
    </MDBCollapseHeader>
  );
}
