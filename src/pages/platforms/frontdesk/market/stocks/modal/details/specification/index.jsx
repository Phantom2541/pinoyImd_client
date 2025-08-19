import { MDBInput } from "mdbreact";

const Specifications = () => {
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
          color: "blue",
        }}
      >
        Specifications
      </span>
      <div className="p-2">
        <div className="d-flex align-items-center">
          <div>
            <MDBInput label="Title" />
          </div>
          <div>
            <span className="fw-bold mx-2">:</span>
          </div>
          <div className="w-100">
            <MDBInput label="Description" placeholder="test" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specifications;
