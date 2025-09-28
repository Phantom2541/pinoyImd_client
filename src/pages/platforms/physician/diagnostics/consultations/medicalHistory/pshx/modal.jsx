import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBBtnGroup,
} from "mdbreact";
import { capitalize, fullName } from "../../../../../../../services/utilities";
import { useEffect, useState } from "react";
import {
  ADD_ITEM as SAVE,
  TOGGLE_ITEM,
} from "../../../../../../../services/redux/slices/diagnostics/cases";
import Spinner from "../../../../../../../components/spinner";
import {
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Details from "../../case/modal/details";

const _details = {
  diagnosis: "",
  status: "active",
  date: {
    start: "",
    end: "",
  },
  hospital: "",
  ap: [],
  remarks: "",
};
export default function CaseModal() {
  const { token } = useSelector(({ auth }) => auth);
  const { showItem: show, selected } = useSelector(({ cases }) => cases);
  const { patient: appointment, cluster } = useSelector(
      ({ appointments }) => appointments
    ),
    { patient = {} } = appointment,
    { formSubmitted } = useSelector(({ cases }) => cases),
    [details, setDetails] = useState(_details),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_ITEM());

  useEffect(() => {
    if (show) {
      setDetails({ ..._details });
    }
  }, [show]);

  const handleSave = (e) => {
    e.preventDefault();

    dispatch(SAVE({ data: { ...details, case: selected?._id }, token })).then(
      (action) => {
        const { payload } = action.payload;

        // clone top-level cluster
        const _cluster = [...cluster];
        const pIndex = _cluster.findIndex((p) => p._id === appointment?._id);

        // clone old cases para hindi readonly
        const oldCases = [...(_cluster[pIndex]?.cases || [])];

        const cIndex = oldCases.findIndex((c) => c?._id === payload.case);

        // clone items din
        const items = [...(oldCases[cIndex]?.items || [])];
        items.unshift(payload);

        // replace case with a new object
        oldCases[cIndex] = { ...oldCases[cIndex], items };

        // replace patient with a new object
        _cluster[pIndex] = {
          ..._cluster[pIndex],
          cases: oldCases,
        };

        dispatch(SetPATIENT({ ...appointment, cases: [...oldCases] }));
        dispatch(SetCLUSTER([..._cluster]));
        toggle();
      }
    );
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={toggle}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="suitcase" className="appEhr mr-2" />
        Add Detail for {capitalize(selected?.title)} <br />
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
          <Details form={details} setForm={setDetails} />
          <div className="d-flex justify-content-end">
            <MDBBtnGroup>
              <MDBBtn
                size="md"
                color="primary"
                type="submit"
                rounded
                disabled={formSubmitted}
              >
                Save
                {formSubmitted && <Spinner formSubmitted={formSubmitted} />}
              </MDBBtn>
            </MDBBtnGroup>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
