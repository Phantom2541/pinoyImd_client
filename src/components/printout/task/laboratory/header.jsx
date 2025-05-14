import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAge,
  fullName as nameFormatter,
} from "../../../../services/utilities";
import { MDBRow, MDBCol, MDBAlert } from "mdbreact";
import { Categories } from "../../../../services/fakeDb";
import { formColor } from "../../../../services/utilities";

export default function Header() {
  const { selected } = useSelector(({ deals }) => deals),
    [task, setTask] = useState({ _id: "" });

  useEffect(() => {
    if (selected) {
      setTask(selected);
    }
  }, [selected]);

  const { category, patient = {}, source, referral, form, updatedAt } = task;
  const { fullName: pFull, isMale = false, dob = "", _id } = patient;
  const categoryWidth = source && referral ? "30%" : "64.2%";

  return (
    <div className="px-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          Name:&nbsp;
          <h5 className="mb-0 fw-bold text-nowrap">
            <u className="text-nowrap">{nameFormatter(pFull, true)}</u>
          </h5>
        </div>
        <div>
          <span>Date: {new Date(updatedAt).toDateString()}</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          Patient CODE :&nbsp;
          <span
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            {_id}
          </span>
        </div>
        <div>
          <span>Time: {new Date(updatedAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </div>
        <div>
          <span>Transaction # : {task._id}</span>
        </div>
      </div>

      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: categoryWidth }}>
            Category:&nbsp;
            {category === "walkin"
              ? "Walkin"
              : Categories.find(({ abbr }) => abbr === category)?.name}
          </span>
        </MDBCol>
      </MDBRow>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span>Physician: Dr. {referral?.fullName?.lname}</span>
        </div>
        <div>
          <span>Source: {source?.displayname}</span>
        </div>
      </div>

      <MDBAlert
        color={formColor(form)}
        className="text-uppercase text-center py-0 mb-1 mt-2"
      >
        <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
          {form}
        </h5>
      </MDBAlert>
    </div>
  );
}
