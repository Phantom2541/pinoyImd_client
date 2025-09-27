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
  MDBBtnGroup,
} from "mdbreact";
import { fullName } from "../../../../../../../services/utilities";
import { EditableSelect } from "../../../../../../../components/customizable";
import { useEffect, useState } from "react";
import { SAVE } from "../../../../../../../services/redux/slices/diagnostics/cases";
import Spinner from "../../../../../../../components/spinner";
import {
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Stepper from "../../../../../../../components/stepper";
import Information from "./info";
import Details from "./details";
const _form = {
  title: "",
  description: "",
  caseSummary: "",
  category: "medical",
};
const _details = {
  diagnosis: "",
  status: "active",
  date: {
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  },
  hospital: "",
  physician: {
    name: "",
    specialization: "",
  },
  remarks: "",
};
const steps = ["Information", "Details"];
export default function Modal({ show, toggle = () => {}, defaultCase = "" }) {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { patient: appointment, cluster } = useSelector(
      ({ appointments }) => appointments
    ),
    { patient = {} } = appointment,
    { formSubmitted } = useSelector(({ cases }) => cases),
    [form, setForm] = useState(_form),
    [isDuplicate, setIsDuplicate] = useState(false),
    [details, setDetails] = useState(_details),
    [activeStep, setActiveStep] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    setForm(_form);
    if (show) {
      setForm({ ..._form, title: defaultCase });
      setDetails({ ..._details });
      setActiveStep(0);
    }
  }, [defaultCase, show]);

  useEffect(() => {
    const { cases = [] } = appointment;
    if (appointment && form?.title) {
      const serialize = (text) => text.toLowerCase().replace(/\s+/g, "").trim();
      setIsDuplicate(
        cases.some((c) => serialize(c.title) === serialize(form?.title))
      );
    } else {
      setIsDuplicate(false);
    }
  }, [appointment, form?.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(true);
  };

  const handleSave = (hasDetails = false) => {
    setForm({ ...form, hasDetails });
    const data = {
      case: { ...form, branch: activePlatform?.branchId, pId: patient._id },
      hasDetails,
      details,
    };

    dispatch(SAVE({ data, token })).then((action) => {
      const { payload } = action.payload;
      const _cluster = [...cluster];
      const pIndex = _cluster.findIndex((p) => p._id === appointment?._id);
      const oldCases = _cluster[pIndex]?.cases || [];
      const newCases = [payload, ...oldCases]; // create a new array
      console.log("new caseeeee", newCases);
      _cluster[pIndex] = {
        ..._cluster[pIndex],
        cases: newCases,
      };

      dispatch(SetPATIENT({ ...appointment, cases: newCases }));
      dispatch(SetCLUSTER(_cluster));
      toggle(payload);
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveStep(activeStep + 1);
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
        <Stepper steps={steps} activeStep={activeStep} />
        {activeStep === 0 ? (
          <form onSubmit={handleNext}>
            <div>
              <Information
                form={form}
                setForm={setForm}
                isDuplicate={isDuplicate}
              />
              <MDBBtn
                color="info"
                type="submit"
                className="float-right"
                rounded
                disabled={isDuplicate}
                size="md"
              >
                Next <MDBIcon icon="arrow-right" className="ml-2" />
              </MDBBtn>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <Details form={details} setForm={setDetails} />
            <div className="d-flex justify-content-between">
              <MDBBtn
                size="md"
                color="light"
                rounded
                onClick={() => setActiveStep(0)}
              >
                <MDBIcon icon="arrow-left" className="mr-2" /> Prev
              </MDBBtn>
              <div>
                <MDBBtnGroup>
                  <MDBBtn
                    size="md"
                    color="info"
                    type="button"
                    rounded
                    disabled={formSubmitted}
                    onClick={() => handleSave(false)}
                  >
                    Skip
                    {!form.hasDetails && formSubmitted && (
                      <Spinner formSubmitted={formSubmitted} />
                    )}
                  </MDBBtn>
                  <MDBBtn
                    size="md"
                    color="primary"
                    type="submit"
                    rounded
                    disabled={formSubmitted}
                  >
                    Save
                    {form.hasDetails && formSubmitted && (
                      <Spinner formSubmitted={formSubmitted} />
                    )}
                  </MDBBtn>
                </MDBBtnGroup>
              </div>
            </div>
          </form>
        )}
      </MDBModalBody>
    </MDBModal>
  );
}
