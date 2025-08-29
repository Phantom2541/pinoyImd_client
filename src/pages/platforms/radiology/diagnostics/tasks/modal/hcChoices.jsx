import { MDBModal, MDBModalBody, MDBModalHeader, MDBBtn } from "mdbreact";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadHC } from "../../../../../../services/fakeDb";
import { SetHEALTHY_RAD } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const HealthyClientChoices = ({ show, toggle = () => {} }) => {
  const { task } = useSelector(({ validator }) => validator);
  const [choices, setChoices] = useState([]);
  const dispatch = useDispatch();
  const isEcg = task?.form === "Ecg";
  useEffect(() => {
    const results = RadHC.getByModality(task?.form) || [];
    setChoices(results);
  }, [task]);

  const setHealthy = (item) => {
    const { description, impression } = item;
    dispatch(
      SetHEALTHY_RAD({
        description,
        [isEcg ? "findings" : "impression"]: impression,
      })
    );
    toggle();
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop frame>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        Select Healthy Client Result
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {choices.length === 0 && <p>No healthy result available.</p>}
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {choices.map((item, index) => (
            <div key={index} className="border rounded p-3 mb-2">
              <div
                className="form-check"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`choice-${index}`}
                  checked={false}
                  onChange={() => setHealthy(item)}
                />
                <label
                  htmlFor={`choice-${index}`}
                  className="form-check-label mb-1"
                ></label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <label
                    htmlFor={`choice-${index}`}
                    className="form-check-label mb-1"
                  >
                    <strong>{isEcg ? "Findings" : "Impression"}:</strong>{" "}
                    {item.impression}
                  </label>
                  {!isEcg && (
                    <label
                      htmlFor={`choice-${index}`}
                      className="form-check-label"
                    >
                      <strong>Description:</strong> {item.description}
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </MDBModalBody>
    </MDBModal>
  );
};

export default HealthyClientChoices;
