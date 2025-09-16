import {
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
} from "mdbreact";
import { Templates } from "../../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SetDIAGNOSTIC } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
const _form = {
  section: "",
  img: "",
  date: "",
};

const Upload = () => {
  const { selected, diagnostic } = useSelector(
      ({ appointments }) => appointments
    ),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();
  const { images = [] } = diagnostic || {};
  const { department = "" } = selected || {};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, img: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const _images = [...images];
    _images.push(form);
    dispatch(SetDIAGNOSTIC({ ...diagnostic, images: _images }));
  };
  return (
    <MDBCard className="shadow-sm border-0 rounded-3">
      <MDBCardBody>
        <span style={{ fontWeight: 500 }} className="mb-2 d-block">
          Upload Image
        </span>
        <form onSubmit={handleUpload}>
          <MDBRow className="mb-3">
            <MDBCol>
              <label className="text-muted small mb-1">Section</label>
              <select
                className="form-control"
                required
                value={form?.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              >
                <option>Choose a section</option>
                {Templates.getComponents(department.toUpperCase()).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </MDBCol>

            <MDBCol>
              <label className="text-muted small mb-1">Date of Result</label>
              <input
                type="date"
                className="form-control"
                value={form?.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </MDBCol>
          </MDBRow>

          <div className="d-flex align-items-center w-full  ">
            <div className="w-full flex-grow-1">
              <input
                type="file"
                className="form-control w-full"
                accept="image/*"
                style={{ cursor: "pointer" }}
                onChange={handleFileChange}
                required
              />
            </div>
            <MDBBtn color="primary" size="sm" className="px-4" type="submit">
              <MDBIcon icon="upload" className="mr-2" /> Upload
            </MDBBtn>
          </div>
        </form>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Upload;
