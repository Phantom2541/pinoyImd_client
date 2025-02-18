import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBModalFooter,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { SAVE } from "../../../../../services/redux/slices/responsibilities/liabilities";
import { capitalize, fullName } from "../../../../../services/utilities";
import { PATIENTS } from "../../../../../services/redux/slices/assets/persons/users";
import { BROWSE } from "../../../../../services/redux/slices/assets/sources";
import { Liabilities } from "../../../../../services/fakeDb";

// declare your expected items
const _form = {
  holiday: 0,
  overtime: 0,
  bonus: 0,
  ca: 0,
  absent: 0,
  loan: 0,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { collections: patients } = useSelector(({ users }) => users),
    { collections: sources } = useSelector(({ providers }) => providers),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [isParticular, setIsParticular] = useState(true),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform) {
      dispatch(PATIENTS({ token }));
      dispatch(BROWSE({ token, key: { clients: activePlatform?.branchId } }));
    }
  }, [token, activePlatform, dispatch]);

  // console.log(selected);
  const handleSubmit = () => {
    dispatch(
      SAVE({
        data: {
          ...form,
          userId: auth._id,
          branchId: activePlatform?.branchId,
          range: [form?.start, form?.end],
        },
        token,
      })
    );
    toggle();
  };

  // use for direct values like strings and numbers
  const handleValue = (key) => console.log(key);

  // willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Payable
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBNav color="primary" tabs className="nav-justified">
          <MDBNavItem key={`tab-Particular`}>
            <MDBNavLink
              link
              active={isParticular}
              to="#!"
              onClick={() => setIsParticular(true)}
            >
              Particular
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem key={`tab-Vendor`}>
            <MDBNavLink
              link
              active={isParticular === false}
              to="#!"
              onClick={() => setIsParticular(false)}
            >
              Vendor
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <div className="mt-5">
          {isParticular ? (
            <>
              <span>Particular</span>
              <select
                value={handleValue("particular")}
                onChange={({ target }) =>
                  handleChange("particular", target.value)
                }
                className="form-control"
              >
                {patients?.map((patient, index) => (
                  <option key={`patient-${index}`} value={patient?._id}>
                    {capitalize(fullName(patient?.fullName))}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              {console.log(sources)}
              <span>Vendor</span>
              <select
                value={handleValue("supplier")}
                onChange={({ target }) =>
                  handleChange("supplier", target.value)
                }
                className="form-control"
              >
                {sources?.map((source, index) => (
                  <option key={`source-${index}`} value={source?.vendors?._id}>
                    {source?.vendors?.companyId?.name}{" "}
                    {source?.vendors?.companyId?.subName}
                  </option>
                ))}
              </select>
            </>
          )}
          <>
            <span>Statement</span>
            <select
              value={handleValue("fsId")}
              onChange={({ target }) => handleChange("fsId", target.value)}
              className="form-control"
            >
              <option></option>
              {Liabilities?.map((statement, index) => (
                <option key={`statement-${index}`} value={statement.id}>
                  {statement?.title}
                </option>
              ))}
            </select>
          </>
          <MDBRow>
            <MDBCol>
              <MDBInput
                type="text"
                label="Amount"
                value={handleValue("amount")}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
                icon="money-bill"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="date"
                label="Due"
                value={handleValue("due")}
                onChange={(e) => handleChange("due", e.target.value)}
                required
                icon="calendar"
              />
            </MDBCol>
          </MDBRow>

          <h5>Biling Range</h5>
          <MDBRow>
            <MDBCol>
              <MDBInput
                type="date"
                label="Start"
                value={handleValue("start")}
                onChange={(e) => handleChange("start", e.target.value)}
                required
                icon="calendar"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="date"
                label="End"
                value={handleValue("end")}
                onChange={(e) => handleChange("end", e.target.value)}
                required
                icon="calendar"
              />
            </MDBCol>
          </MDBRow>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="btn btn-info"
        >
          Submit
        </button>
      </MDBModalFooter>
    </MDBModal>
  );
}
