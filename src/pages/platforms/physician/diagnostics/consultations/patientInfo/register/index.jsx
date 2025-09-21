import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
  MDBBtn,
} from "mdbreact";
import { useLocation, useHistory } from "react-router-dom";

import Info from "./info";
import { useEffect, useState } from "react";
import { generateEmail } from "../../../../../../../services/utilities";
import { SAVE } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Spinner from "../../../../../../../components/spinner";

export default function Register({ searchValue, show, toggle = () => {} }) {
  const { token, auth } = useSelector(({ auth }) => auth);
  const { patient: appointment, formSubmitted } = useSelector(
    ({ appointments }) => appointments
  );
  const [form, setForm] = useState({ patient: {} });
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (show) {
      setForm({ patient: { fullName: searchValue } });
    }
  }, [show, searchValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newqn = parseFloat((appointment?.qn + 0.1).toFixed(1));
    const newAppt = {
      patient: {
        ...form.patient,
        password: form?.patient?.dob.replaceAll("-", ""),
        email: form?.patient?.email || generateEmail(form?.patient),
      },
      isRegister: true,
      clinic: appointment.clinic,
      sched: appointment.sched,
      qn: newqn,
      userId: auth._id,
      status: "confirmed",
    };
    dispatch(SAVE({ data: newAppt, token })).then((action) => {
      const { payload } = action.payload;
      const newParams = new URLSearchParams(location.search);
      newParams.set("ehrId", payload?._id); // add if missing, replace if exists
      history.replace(`${location.pathname}?${newParams.toString()}`);
      toggle();
      setForm({ patient: {} });
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size={"md"}>
      <MDBModalHeader
        toggle={toggle}
        className=" light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-injured " className=" mr-2" />
        Register Patient
      </MDBModalHeader>

      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <div className="mt-n2">
            <MDBTypography note noteColor="info" noteTitle="Note: ">
              This patient will automatically have an appointment created for
              schedule
              <span className="ml-1 fw-bold">{appointment?.sched}</span>.
            </MDBTypography>
          </div>
          <Info form={form} setForm={setForm} />
          <div className="text-center">
            <MDBBtn rounded color="info" type="submit" disabled={formSubmitted}>
              Register <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
