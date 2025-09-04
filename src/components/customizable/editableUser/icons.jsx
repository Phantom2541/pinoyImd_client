import { MDBIcon } from "mdbreact";

const Icons = ({ formSubmitted, handleClose, handleCheck }) => {
  return (
    <div className="editable-user-input-icons">
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
          }}
        />
      )}
      <MDBIcon
        icon="times"
        onClick={() => handleClose()}
        disabled={formSubmitted}
        className="cursor-pointer"
        style={{ color: "red", fontSize: "1rem" }}
      />
    </div>
  );
};

export default Icons;
