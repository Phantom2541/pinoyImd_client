import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdbreact";
import { fullName } from "../../../../../../services/utilities";
import { EditableSelect } from "../../../../../../components/customizable";
import { useEffect, useState } from "react";
import { SAVE } from "../../../../../../services/redux/slices/diagnostics/cases";
import Spinner from "../../../../../../components/spinner";
import {
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
const _form = {
  title: "",
  hospital: "",
  description: "",
  diagnosis: "",
  caseSumarry: "",
  dc: "",
  tags: "",
  remarks: "",
  category: "medical",
  notes: "",
};
export default function Modal({ show, toggle = () => {}, defaultCase = "" }) {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const { patient: appointment, cluster } = useSelector(
      ({ appointments }) => appointments
    ),
    { patient = {}, consultation = {}, clinic } = appointment;

  const { formSubmitted } = useSelector(({ cases }) => cases);
  const [form, setForm] = useState(_form);
  const dispatch = useDispatch();

  useEffect(() => {
    setForm({ _form });
    if (show) {
      setForm({ ..._form, title: defaultCase });
    }
  }, [defaultCase, show]);

  const handleChange = (e, key = "") => {
    setForm({ ...form, [key]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { tags, notes, ...rest } = form;
    const data = {
      ...rest,
      pId: patient._id,
      branch: activePlatform?.branchId,
      tags: [tags],
      appointment: appointment._id,
      consultation: consultation._id,
      clinic,
      ap: [
        {
          notes,
          userId: auth._id,
          specialization: activePlatform?.branch?.specialization,
        },
      ],
    };

    dispatch(SAVE({ data, token })).then((action) => {
      const { payload } = action.payload;
      const _cluster = [...cluster];
      const pIndex = _cluster.findIndex((p) => p._id === appointment?._id);
      if (pIndex !== -1) {
        _cluster[pIndex] = {
          ..._cluster[pIndex],
          consultation: payload,
        };
      }

      dispatch(SetPATIENT({ ...appointment, consultation: payload }));
      dispatch(SetCLUSTER(_cluster));
      toggle(payload);
    });
  };
  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={toggle}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-injured" className="appEhr mr-2" />
        {fullName(patient?.fullName)}
      </MDBModalHeader>

      <MDBModalBody className="appEhr mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Title"
                value={form?.title || ""}
                required
                onChange={(e) => handleChange(e, "title")}
              />
            </MDBCol>

            <MDBCol>
              <MDBInput
                label="Diagnosis Code"
                value={form.dc}
                onChange={(e) => handleChange(e, "dc")}
              />
            </MDBCol>

            <MDBCol>
              <MDBInput
                label="Tags"
                value={form.tags}
                onChange={(e) => handleChange(e, "tags")}
              />
            </MDBCol>
            <MDBCol>
              <EditableSelect
                collections={["medical", "surgical"]}
                label="Category"
                value={form.category}
                preValue={form.category}
                onChange={(e) => setForm({ ...form, category: e })}
                className="mt-4"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Hospital"
                value={form.hospital}
                onChange={(e) => handleChange(e, "hospital")}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                type="textarea"
                label="Case Summary"
                value={form.caseSumarry}
                onChange={(e) => handleChange(e, "caseSumarry")}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="textarea"
                label="Description"
                value={form.description}
                onChange={(e) => handleChange(e, "description")}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                type="textarea"
                label="Remarks"
                value={form.remarks}
                onChange={(e) => handleChange(e, "remarks")}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="textarea"
                label="Notes for patient"
                value={form.notes}
                onChange={(e) => handleChange(e, "notes")}
              />
            </MDBCol>
          </MDBRow>
          <div className="text-center">
            <MDBBtn color="info" type="submit" disabled={formSubmitted}>
              Submit <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
