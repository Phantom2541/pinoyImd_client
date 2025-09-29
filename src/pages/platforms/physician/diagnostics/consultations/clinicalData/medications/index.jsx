import { MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE_MEDICATION } from "../../../../../../../services/redux/slices/diagnostics/ehr";
import { useState } from "react";
import { capitalize } from "../../../../../../../services/utilities";

const Medications = () => {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [expanded, setExpanded] = useState(null);
  const dispatch = useDispatch();

  const { ehr = {} } = appointment || {};
  const { medications = [] } = ehr || {};

  return (
    <div className="checkup-data-mh-container">
      <div className="pshx-container">
        <h2 className="pshx-title w-full">
          Maintenance Medications
          <button
            size="sm"
            style={{
              marginRight: "-5px",
            }}
            onClick={() => dispatch(TOGGLE_MEDICATION())}
            // color="white"
            className="search-add-btn ml-2 py-1 float-right  mt-2"
          >
            <MDBIcon icon="plus" size="sm" />
          </button>
        </h2>

        <div className="pshx-timeline">
          {medications.length > 0 ? (
            medications.map((medication, index) => {
              const {
                name,
                dosage,
                frequency,
                form,
                duration = "",
                reason = "",
              } = medication;
              return (
                <div
                  key={index}
                  className={`pshx-item ${
                    expanded === index ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setExpanded((prev) => (prev === index ? null : index))
                  }
                >
                  <div className="pshx-dot" />
                  <div className="pshx-content">
                    <div className="pshx-header">
                      <div>
                        <span className="pshx-procedure">
                          {capitalize(name)}-{capitalize(dosage)} ,
                        </span>
                        <span> {capitalize(frequency)}</span>
                      </div>
                      {/* <button
                        size="sm"
                        style={{
                          marginRight: "-5px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // dispatch(SetITEM(surgery));
                        }}
                        // color="white"
                        className="search-add-btn ml-2 py-1 "
                      >
                        <MDBIcon icon="plus" size="sm" />
                      </button> */}
                    </div>
                    <div
                      className={`pshx-body ${
                        expanded === index ? "show" : "hide"
                      }`}
                    >
                      <p className="pshx-complication">
                        <strong>Medicine:</strong> {capitalize(name)}
                      </p>
                      <p>
                        <strong>Dosage:</strong> {capitalize(dosage)}
                      </p>
                      <p>
                        <strong>Form:</strong> {capitalize(form)}
                      </p>
                      <p>
                        <strong>Frequency:</strong> {capitalize(frequency)}
                      </p>
                      {duration && (
                        <p>
                          <strong>Duration:</strong> {capitalize(duration)}
                        </p>
                      )}
                      {reason && (
                        <p>
                          <strong>Reason:</strong> {capitalize(reason)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h5 className="text-center grey-text">
              {" "}
              <MDBIcon icon="capsules" /> No Maintenance Medication Record
            </h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;
