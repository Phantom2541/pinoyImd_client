import React, { useState } from "react";
import "./style.css";
import Header from "./header";
import Modal from "./modal";
import ID from "./id";
import Setting from "./setting";

export default function GeneratorID() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDFP, setSavedDFP] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  return (
    <div>
      <Header setIsModalOpen={setIsModalOpen} />
      <div className="d-flex align-items-start" style={{ gap: "20px" }}>
        <ID dfpData={savedDFP} frontImage={frontImage} backImage={backImage} />
      </div>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={(dfp, front, back) => {
          setSavedDFP(dfp);
          setFrontImage(front);
          setBackImage(back);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
