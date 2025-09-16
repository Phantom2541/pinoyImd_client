import Upload from "./upload";
import Table from "./table";
import { useState } from "react";
import { MDBAnimation } from "mdbreact";
import Img from "./preview";

const Images = () => {
  const [preview, setPreview] = useState(null);
  const hasImg = Boolean(preview?.img || preview?.imgId);

  return (
    <MDBAnimation
      key={preview ? hasImg || "no-img" : "empty"} // 👈 unique key kada state
      type={preview === null ? "" : hasImg ? "fadeInDown" : "fadeInDown"}
    >
      {!hasImg ? (
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
