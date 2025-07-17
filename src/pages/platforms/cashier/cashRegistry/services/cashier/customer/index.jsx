import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon } from "mdbreact";
import Patient from "./form/patient";
import Classification from "./form/classification";
import {
  RESET_INSOURCE,
  SETPATIENT,
  SETSEARCHKEY,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos";
import { fullName, getAge } from "../../../../../../../services/utilities";
import { SearchUser as Search } from "../../../../../../../components/searchables";
import Swal from "sweetalert2";

export default function POS() {
  const { isLoading, message } = useSelector(({ users }) => users),
    { customer } = useSelector(({ pos }) => pos),
    [activeIndex, setActiveIndex] = useState(0),
    dispatch = useDispatch();

  // if a newPatient id is present and active index is 1
  // it means a new patient has been injected, you should go back to POS
  useEffect(() => {
    if (message.name === "Error") {
      console.log("message", message);

      Swal.fire({
        title: "Duplicate Entry",
        text: message.message,
        icon: "warning",
      });
    }
  }, [message]);

  const handleCustomer = (customer) => dispatch(SETPATIENT(customer));

  const handleRegister = (customer) => {
    if (isLoading) return;
    if (!activeIndex) setActiveIndex(1);
    dispatch(SETSEARCHKEY(customer));
  };

  return (
    <div className="pos-container ">
      <div
        className={`pos-container-header  ${customer?._id && "pickedSearch"}`}
      >
        {customer?._id && (
          <div
            style={{ width: "100%", marginBottom: "-0.5rem" }}
            className="d-flex "
          >
            <h5>
              <MDBIcon icon="mars" className="text-primary mr-2 mt-2" />
            </h5>
            <div style={{ width: "100%" }}>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <div>
                  <h5 style={{ fontWeight: "500" }}>
                    {fullName(customer?.fullName)} |{" "}
                    <span>{getAge(customer?.dob)}</span>
                  </h5>
                </div>
                <MDBBtn
                  rounded
                  color="danger"
                  title="Clear"
                  size="sm"
                  onClick={() => {
                    dispatch(SETPATIENT({}));
                    dispatch(RESET_INSOURCE());
                  }}
                  className="px-2"
                >
                  <MDBIcon icon="times" />
                </MDBBtn>
              </div>
              <h6
                style={{
                  marginTop: "-0.6rem",
                  display: "block",
                }}
              >
                <span className="grey-text">Birthday:</span>
                <span style={{ fontWeight: 400 }} className="ml-1">
                  {new Date(customer?.dob).toDateString()}
                </span>
              </h6>
            </div>
          </div>
        )}
        {!customer?.fullName && (
          <div style={{ width: "90%" }}>
            <Search setPatient={handleCustomer} setRegister={handleRegister} />
          </div>
        )}
      </div>
      <div className="pos-card-button">
        {["Class", "Patient"]?.map((name, index) => {
          return (
            <button
              key={`button-${index}`}
              className={`${activeIndex === index && "active"}`}
              onClick={() => setActiveIndex(index)}
            >
              {name}
              <MDBIcon
                icon={name === "Class" ? "cogs" : "user-injured"}
                className="pos-button-icon"
              />
            </button>
          );
        })}
      </div>
      <div className="pos-card">
        <div className="pos-card-body">
          <section className={`${activeIndex === 0 && "active"}`}>
            <Classification />
          </section>
          <section className={`${activeIndex === 1 && "active"}`}>
            <Patient setActiveIndex={setActiveIndex} />
          </section>
        </div>
      </div>
    </div>
  );
}
