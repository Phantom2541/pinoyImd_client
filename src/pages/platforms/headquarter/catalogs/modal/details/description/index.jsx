import { MDBInput } from "mdbreact";

const Description = () => {
  return (
    <div
      style={{
        border: "1px solid #cfc8c8ff",
        position: "relative",
        margin: "20px 0",
        paddingTop: "10px",
        borderRadius: "5px",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "-12px",
          left: "15px",
          background: "#fff", // same as container background
          padding: "0 5px",
          color: "gray",
        }}
      >
        Description
      </span>
      <div className="p-2">
        <MDBInput
          label="Enter description here.."
          type="textarea"
          className="mb-n4"
        />
      </div>
    </div>
  );
};

export default Description;
