import { MDBCard, MDBCardBody, MDBCol, MDBRow, MDBView } from "mdbreact";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "../../../../../components/customizable";

const Index = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const [selected, setSelected] = useState({});
  // const dispatch = useDispatch();

  const { activePlatform } = useSelector(({ auth }) => auth);
  const philhealth = activePlatform?.philhealth || {};

  const handleSelected = (data) => {
    const { id, ...val } = data;
    const [key] = Object.keys(val);
    const value = val[key];

    if (selected?.id === id && selected.key === key) {
      setSelected({});
    } else {
      setSelected({ id, key, value, old: value });
    }
  };

  const handleUpdate = () => {
    const { id, key, value } = selected;
    console.log("updated", { id, [key]: value });
    // dispatch(...) here
    setSelected({});
  };

  const renderEditableField = (label, keyName, type = "text") => (
    <h6>
      <b>{label}:</b>{" "}
      {selected?.key === keyName ? (
        <div style={{ width: "13rem" }}>
          <Input
            _key={"value"}
            className="mt-2 form-control form-control-sm"
            type={type}
            isSuccess={true}
            selected={selected}
            onChange={(key, val) => setSelected({ ...selected, [key]: val })}
            handleCheck={handleUpdate}
            handleClose={() => setSelected({})}
          />
        </div>
      ) : (
        <strong
          onClick={() =>
            handleSelected({
              id: "philhealth",
              [keyName]: philhealth[keyName] || "",
            })
          }
        >
          {philhealth[keyName] || "N/A"}
        </strong>
      )}
    </h6>
  );

  const ToggleSwitch = ({ isToggled, setIsToggled }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{ minWidth: "20px", marginBottom: "8px", textAlign: "right" }}
      >
        False
      </span>
      <label
        style={{
          position: "relative",
          display: "inline-block",
          width: "40px",
          height: "21px",
        }}
      >
        <input
          type="checkbox"
          checked={isToggled}
          onChange={() => setIsToggled(!isToggled)}
          style={{
            opacity: 0,
            width: 0,
            height: 0,
            margin: 0,
            padding: 0,
          }}
        />
        <span
          style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isToggled ? "#05e30c" : "#4a4a4a",
            borderRadius: "34px",
            transition: "0.4s",
          }}
        >
          <span
            style={{
              position: "absolute",
              height: "15px",
              width: "15px",
              left: isToggled ? "22px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              transition: "0.4s",
              borderRadius: "50%",
            }}
          />
        </span>
      </label>
      <span style={{ minWidth: "20px", marginBottom: "8px" }}>True</span>
    </div>
  );

  return (
    <div style={{ width: "800px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody>
          <MDBView className="text-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/11/Www.philhealth.gov.ph.png"
              alt="Philhealth"
              style={{
                height: "150px",
                width: "100%",
                paddingLeft: "20%",
                paddingRight: "20%",
              }}
            />
            <h5>
              <b>Accreditation</b>
            </h5>
          </MDBView>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <ToggleSwitch
              isToggled={toggleValue}
              setIsToggled={setToggleValue}
            />
          </div>

          {toggleValue && (
            <MDBRow
              className="my-2"
              style={{ width: "100%", paddingLeft: "20%" }}
            >
              <MDBCol md="6">
                {renderEditableField(
                  "Accreditation Number",
                  "accreditationNumber"
                )}
                <h6>
                  <b>Validity</b>
                </h6>
                {renderEditableField("Start", "start", "date")}
                {renderEditableField("End", "end", "date")}
                {renderEditableField("Remarks", "remarks")}
              </MDBCol>
              <MDBCol md="6">
                <h6 className="text-md-end">
                  {/* Right-aligned optional content */}
                </h6>
              </MDBCol>
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Index;
