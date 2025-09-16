import Upload from "./upload";
import Table from "./table";
import { useState } from "react";
import { MDBAnimation } from "mdbreact";
import Img from "./preview";

const Images = () => {
  const [preview, setPreview] = useState(null);
  return (
    <MDBAnimation
      key={preview ? preview.img || "no-img" : "empty"} // 👈 unique key kada state
      type={
        preview === null ? "" : preview?.img ? "slideInRight" : "slideInRight"
      }
    >
      {!preview?.img ? (
        <>
          {" "}
          <Upload />
          <Table setPreview={setPreview} />
        </>
      ) : (
        <Img preview={preview} setPreview={setPreview} />
      )}
    </MDBAnimation>
  );
};

export default Images;
