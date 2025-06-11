import { MDBIcon } from "mdbreact";

const ConfirmButtons = ({
  isEditMode = false,
  formSubmitted = false,
  handleCheck = () => {},
  handleClose = () => {},
}) => {
  return (
    <>
      {isEditMode && (
        <div className="d-flex align-items-center ml-2">
          {!formSubmitted ? (
            <MDBIcon
              icon="check"
              onClick={() => handleCheck()}
              style={{
                color: "blue",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "7px",
              }}
              className="cursor-pointer"
            />
          ) : (
            <MDBIcon
              icon="spinner"
              pulse
              style={{
                color: "black",
                fontSize: "1rem",
                marginRight: "10px",
                marginLeft: "10px",
              }}
            />
          )}
          <MDBIcon
            icon="times"
            onClick={() => handleClose()}
            className="cursor-pointer"
            style={{ color: "red", fontSize: "1rem" }}
          />
        </div>
      )}
    </>
  );
};

export default ConfirmButtons;
