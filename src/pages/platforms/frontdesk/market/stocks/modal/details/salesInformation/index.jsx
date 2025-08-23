import Basic from "./basic";
import { MDBBtn, MDBIcon } from "mdbreact";
import Variations from "./variations";

const SalesInformation = ({
  info,
  variants = {},
  setInfo = () => {},
  setVariants = () => {},
  setIsDuplicate = () => {},
}) => {
  const enableVariants = () => {
    setVariants({ types: [{ title: "", options: [""] }] });
  };
  const hasVariants = variants?.types?.length > 0;
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
        Sales Information
      </span>
      <div className="p-2">
        {!hasVariants ? (
          <Basic info={info} setInfo={setInfo} />
        ) : (
          <Variations
            variants={variants}
            setVariants={setVariants}
            setIsDuplicate={setIsDuplicate}
          />
        )}
        {!hasVariants && (
          <MDBBtn
            block
            size="md"
            color="primary"
            outline
            onClick={enableVariants}
          >
            <MDBIcon icon="plus" className="mr-2" /> Enable Variations
          </MDBBtn>
        )}
      </div>
    </div>
  );
};

export default SalesInformation;
