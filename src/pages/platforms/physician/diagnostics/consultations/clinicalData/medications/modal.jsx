import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import { fullName } from "../../../../../../../services/utilities";
import { useEffect, useState } from "react";
import { TOGGLE_MEDICATION } from "../../../../../../../services/redux/slices/diagnostics/ehr";
import {
  SET_EMR,
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Spinner from "../../../../../../../components/spinner";
const _form = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  reason: "",
  form: "",
};

export default function MedicationsModal() {
  const { token } = useSelector(({ auth }) => auth);
  const { showMedication: show, selected } = useSelector(({ ehr }) => ehr);
  const {
      patient: appointment,
      cluster = [],
      formSubmitted,
    } = useSelector(({ appointments }) => appointments),
    { patient = {}, ehr = {} } = appointment,
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_MEDICATION());

  useEffect(() => {
    if (show) {
      setForm(_form);
    }
  }, [show]);

  const handleSave = (e) => {
    e.preventDefault();
    const medications = [...(ehr?.medications || [])];
    medications.push(form);
    dispatch(
      SET_EMR({ data: { medications, patient: patient?._id }, token })
    ).then((action) => {
      const { payload } = action.payload;
      const _cluster = [...cluster];
      const pIndex = _cluster.findIndex((p) => p._id === appointment?._id);
      _cluster[pIndex] = {
        ..._cluster[pIndex],
        ehr: payload,
      };
      dispatch(SetPATIENT({ ...appointment, ehr: payload }));
      dispatch(SetCLUSTER(_cluster));
      toggle(payload);
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="md">
      <MDBModalHeader
        toggle={toggle}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="capsules" className="appEhr mr-2" />
        Add Maintenance Medication
        <div
          style={{
            marginTop: "-0.6rem",
            marginBottom: "-1rem",
          }}
        >
          <MDBIcon
            icon="user-injured"
            style={{ fontSize: "1rem" }}
            className="appEhr mr-2"
          />
          <span style={{ fontSize: "0.9rem" }}>
            {fullName(patient?.fullName)}
          </span>
        </div>
      </MDBModalHeader>

      <MDBModalBody className="appEhr mb-0">
        <form onSubmit={handleSave}>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Name of medicine"
                required
                value={form.name}
                onChange={({ target }) =>
                  setForm({ ...form, name: target.value })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Dosage"
                required
                value={form.dosage}
                onChange={({ target }) =>
                  setForm({ ...form, dosage: target.value })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Form"
                required
                value={form.form}
                onChange={({ target }) =>
                  setForm({ ...form, form: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Frequency"
                required
                value={form.frequency}
                onChange={({ target }) =>
                  setForm({ ...form, frequency: target.value })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Duration"
                value={form.duration}
                onChange={({ target }) =>
                  setForm({ ...form, duration: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Remarks"
                type="textarea"
                value={form.remarks}
                onChange={({ target }) =>
                  setForm({ ...form, remarks: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <div className="text-center">
            <MDBBtn
              color="info"
              rounded
              size="md"
              disabled={formSubmitted}
              type="submit"
            >
              Save <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
