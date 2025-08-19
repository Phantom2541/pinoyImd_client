import { useState } from "react";
import Basic from "./basic";
import { MDBBtn, MDBIcon } from "mdbreact";
import Variations from "./variations";

const SalesInformation = () => {
  const [hasVariants, setHasVariants] = useState(false);
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
        Sales Information
      </span>
      <div className="p-2">
        {!hasVariants ? <Basic /> : <Variations />}
        <MDBBtn
          block
          size="md"
          color="primary"
          outline
          onClick={() => setHasVariants(!hasVariants)}
        >
          <MDBIcon icon="plus" className="mr-2" /> Enable Variations
        </MDBBtn>
      </div>
    </div>
  );
};

export default SalesInformation;
