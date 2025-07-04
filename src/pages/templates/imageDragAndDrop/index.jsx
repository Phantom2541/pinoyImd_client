import React, { useState, useEffect } from "react";
import ImageDragAndDrop from "./dragNdropimg";
import logo from "../../../assets/iMD.png"; // make sure the path is correct

export default function ParentComponent() {
  const [savedImage, setSavedImage] = useState(null);

  const handleImageChange = (file, imageUrl) => {
    setSavedImage(imageUrl);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <ImageDragAndDrop defaultImage={logo} savedImg={handleImageChange} />
    </div>
  );
}
