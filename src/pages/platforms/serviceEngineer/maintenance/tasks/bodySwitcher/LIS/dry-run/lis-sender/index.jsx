import { useDispatch, useSelector } from "react-redux";
import {
  MDBAlert,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBBtn,
  MDBSwitch,
} from "mdbreact";
import {
  TOGGLE_WORK_AREA,
  WORK_AREA,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import Patient from "./patient.jsx";
import {
  Barcode,
  formColor,
} from "../../../../../../../../../services/utilities/index.js";
import { useEffect, useState } from "react";
import Case from "./case.jsx";
import MachineSender from "./machines/index.js";
import Spinner from "../../../../../../../../../components/spinner/index.jsx";
const _form = {
  v: false,
  s: 0,
  w: 0,
  machine: "",
};
export default function LIS_SENDER() {
  const { token } = useSelector(({ auth }) => auth),
    {
      showWorkArea: show,
      work,
      formSubmitted,
    } = useSelector(({ validator }) => validator),
    [form, setForm] = useState(_form),
    [cluster, setCluster] = useState([]),
    dispatch = useDispatch();

  const { section, task, customerId } = work || {};
  useEffect(() => {
    if (show) setForm(_form); //Reset the form
  }, [show]);

  const toggle = () => dispatch(TOGGLE_WORK_AREA());

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await MachineSender(
        work._id,
        section,
        cluster,
        Barcode.getValue(section, customerId, task.pn),
        form.machine
      );
      dispatch(
        WORK_AREA({
          baseURL: `/diagnostics/laboratory/result/${section.toLowerCase()}`,
          token,
          data: {
            _id: task._id,
            workarea: { A15: { t: cluster, ...form } },
          },
        })
      ).then(() => toggle());
    } catch (err) {
      console.error("❌ Error sending to machine:", err);
    }
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <Patient />
      </MDBModalHeader>
      <MDBModalBody className="mb-0 text-center">
        <form onSubmit={handleSubmit}>
          <MDBAlert
            color={formColor(section)}
            className="text-uppercase fw-bold"
          >
            <h5 style={{ letterSpacing: "30px" }} className="mb-0">
              {section}
            </h5>
          </MDBAlert>

          <Case
            cluster={cluster}
            setCluster={setCluster}
            setForm={setForm}
            form={form}
          />
          <div className="d-flex align-items-center justify-content-center">
            <MDBInput
              label="Well"
              type="number"
              min={0}
              required
              style={{ width: "4.5rem" }}
              value={String(form.w || "")}
              onChange={({ target }) =>
                setForm({ ...form, w: Number(target.value) })
              }
            />
            <div className=" mt-4 ml-3">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`Big`}
                  checked={form.vial}
                  onChange={() => setForm({ ...form, vial: !form.vial })}
                />
                <div className="d-flex align-items-center transition-all">
                  <span
                    className="d-block mt-n1 mr-n1"
                    style={{ fontSize: !form.vial ? "1.5rem" : "0.8rem" }}
                  >
                    🧪
                  </span>
                  <MDBSwitch
                    checked={form.vial}
                    labelLeft=""
                    labelRight=""
                    label="Toggle Hiring Status"
                    className=""
                    onChange={() => setForm({ ...form, vial: !form.vial })}
                  />
                  <span
                    className="d-block ml-2 mt-n1"
                    style={{ fontSize: form.vial ? "1.5rem" : "0.8rem" }}
                  >
                    🥃
                  </span>
                </div>
              </div>
            </div>
          </div>
          <MDBBtn
            rounded
            color="primary"
            type="submit"
            disabled={formSubmitted || cluster.length === 0}
          >
            Submit <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
