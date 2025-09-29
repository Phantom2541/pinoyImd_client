import { MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE_MEDICATION } from "../../../../../../../services/redux/slices/diagnostics/ehr";
import { useState } from "react";
import { capitalize } from "../../../../../../../services/utilities";
import { EditableField } from "../../../../../../../components/customizable";
import {
  SET_EMR,
  SetPATIENT,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";

const Medications = () => {
  const { token } = useSelector(({ auth }) => auth),
    {
      patient: appointment,
      formSubmitted,
      isSucess,
      cluster = [],
    } = useSelector(({ appointments }) => appointments);
  const [expanded, setExpanded] = useState(null);
  const dispatch = useDispatch();

  const { ehr = {}, patient } = appointment || {};
  const { medications = [] } = ehr || {};

  const handleUpdate = (data) => {
    const _medications = [...medications];
    const index = _medications.findIndex((m) => m._id === data._id);
    _medications[index] = {
      ..._medications[index],
      ...data,
    };

    dispatch(
      SET_EMR({
        data: { medications: _medications, patient: patient?._id },
        token,
      })
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
    });
  };

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
              const { name, dosage, frequency } = medication;
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
                    </div>
                    <div
                      className={`pshx-body ${
                        expanded === index ? "show" : "hide"
                      }`}
                    >
                      {[
                        "name",
                        "dosage",
                        "form",
                        "frequency",
                        "duration",
                        "reason",
                      ].map(
                        (key, cIdx) =>
                          medication[key] && (
                            <p
                              className={`${
                                cIdx === 0 && "pshx-complication"
                              } d-flex align-items-center`}
                              key={`${key}-${cIdx}`}
                              style={{ marginBottom: "-1px" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <strong>
                                {cIdx === 0 ? "Medicine" : capitalize(key)}:
                              </strong>
                              <EditableField
                                fieldData={{
                                  _id: medication?._id,
                                  [key]: medication[key],
                                }}
                                classNameTxt=" mt-2 ml-1 "
                                className="form-control form-control-sm ml-1"
                                keyForValue={key}
                                onSave={handleUpdate}
                                formSubmitted={formSubmitted}
                                isSucess={isSucess}
                              />
                              {/* {capitalize(name)} */}
                            </p>
                          )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h5 className="text-center grey-text">
              <MDBIcon icon="capsules" /> No Maintenance Medication Record
            </h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;
