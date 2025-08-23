import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBTable,
  MDBTypography,
} from "mdbreact";
import {
  TOGGLE,
  SAVE,
} from "../../../../services/redux/slices/finance/bookkeeping/duties";
import { fullName } from "../../../../services/utilities";
import { Duty, Policy } from "../../../../services/fakeDb";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Spinner from "../../../../components/spinner";
import Months from "../../../../services/fakeDb/calendar/months";
export default function Modal() {
  const { activePlatform, auth, token } = useSelector(({ auth }) => auth),
    { showModal, formSubmitted } = useSelector(({ duties }) => duties),
    { collections = [] } = useSelector(({ personnels }) => personnels),
    { isFirstSched, month, year } = useSelector(({ duties }) => duties),
    [personnels, setPersonnels] = useState([]),
    [codes, setCodes] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    setCodes([]);
    if (showModal) {
      setPersonnels(collections);
    }
  }, [showModal, collections]);

  const lastDayOfMonth = new Date(year, month, 0).getDate();

  // Step 2: Determine which schedule to show
  let scheduleHeader = "";
  if (isFirstSched) {
    scheduleHeader = `Schedule for ${Months[month - 1]} 1–15, ${year}`;
  } else {
    scheduleHeader = `Schedule for ${
      Months[month - 1]
    } 16–${lastDayOfMonth}, ${year}`;
  }

  const handleChange = (personnelID, code) => {
    const _personnels = [...personnels];
    const pIndex = _personnels.findIndex((p) => p._id === personnelID);
    _personnels[pIndex] = { ..._personnels[pIndex], code };

    setPersonnels(_personnels);
    setCodes(_personnels.map((p) => p.code).filter(Boolean));
  };

  const handleSubmit = () => {
    const noSelectedDuty = [...personnels].every(({ code }) => !code);
    if (noSelectedDuty) {
      Swal.fire({
        icon: "warning",
        title: "No Duty Code Selected",
        text: "Please assign at least one duty code to proceed.",
        confirmButtonText: "Okay",
      });
      return;
    }

    const breakdown = [...personnels]
      .filter(({ code }) => code)
      .map(({ user, code }) => ({
        eid: user._id,
        sched: Array.from(
          { length: isFirstSched ? 15 : lastDayOfMonth - 15 },
          (_, i) => {
            const day = isFirstSched ? i + 1 : i + 16;
            const date = new Date(year, month - 1, day);
            const isSunday = date.getDay() === 0;
            return isSunday ? "O" : code;
          }
        ),
      }));
    const data = {
      createdBy: auth._id,
      branchId: activePlatform.branchId,
      month,
      year,
      isFirstSched,
      breakdown,
    };
    dispatch(SAVE({ token, data })).then(() => dispatch(TOGGLE()));
    // proceed with save logic here
  };
  return (
    <MDBModal
      size="lg"
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE())}
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clock" className="mr-2" /> {scheduleHeader}
      </MDBModalHeader>
      <MDBModalBody className="mb-0 ">
        <MDBTypography
          note
          noteColor="warning"
          bqColor="primary"
          noteTitle="Description: "
        >
          No schedule has been assigned yet. Please set or assign a schedule for
          the employees.
        </MDBTypography>

        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
          <MDBTable small>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Duty Code</th>
              </tr>
            </thead>
            <tbody>
              {collections
                .filter(({ contract }) => contract?.designation !== 42)
                .map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {fullName(item.user.fullName)}
                      </span>{" "}
                      <br />
                      <span>
                        {Policy.getPositions(item?.contract?.designation)}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control form-control-sm"
                        value={item?.code}
                        onChange={({ target }) =>
                          handleChange(item._id, target.value)
                        }
                      >
                        <option value="">Choose a duty code</option>
                        {Duty.getWithoutOff().map(
                          ({ code, label, time }, index) => (
                            <option
                              value={code}
                              style={{
                                display: codes.includes(code)
                                  ? "none"
                                  : "block",
                              }}
                              title={`${code} = ${time} ${label}`}
                              key={index}
                            >
                              {code}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </MDBTable>
        </div>
        <div className="text-center">
          <MDBBtn
            rounded
            color="info"
            onClick={handleSubmit}
            disabled={formSubmitted}
          >
            Save <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
