import React, { useState, useRef } from "react";
import "./style.css";
import ID from "./id";
import Setting from "./setting";
import Header from "./header";
import Modal from "./modal";
import { Students as InitialStudents } from "./collections";

export default function GeneratorID() {
  const [isOpen, setIsOpen] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [positions, setPositions] = useState({});
  const [students, setStudents] = useState([...InitialStudents]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedField, setSelectedField] = useState(null); // <--- selected field
  const [fieldStyles, setFieldStyles] = useState({}); // <--- store style per field
  const frontRef = useRef();
  const backRef = useRef();

  const currentStudent = students[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setSelectedField(null); // reset selection when switching student
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < students.length - 1 ? prev + 1 : prev));
    setSelectedField(null);
  };

  return (
    <div>
      <Header setIsOpen={setIsOpen} />
      <div className="d-flex align-items-start" style={{ gap: "10px" }}>
        <ID
          frontImage={frontImage}
          backImage={backImage}
          positions={positions}
          setPositions={setPositions} // <--- add this
          student={currentStudent}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          fieldStyles={fieldStyles}
          frontRef={frontRef} // pass ref
          backRef={backRef} // pass ref
        />
        <Setting
          onPrev={handlePrev}
          onNext={handleNext}
          disablePrev={currentIndex === 0}
          disableNext={currentIndex === students.length - 1}
          selectedField={selectedField}
          fieldStyles={fieldStyles}
          setFieldStyles={setFieldStyles}
          positions={positions}
          setPositions={setPositions}
          student={currentStudent}
          setStudent={(updatedStudent) => {
            const newStudents = [...students];
            newStudents[currentIndex] = updatedStudent;
            setStudents(newStudents);
          }}
          frontImage={frontImage} // <-- add this
          backImage={backImage} // <-- add this
          frontRef={frontRef} // pass ref
          backRef={backRef} // pass ref
        />
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setFrontImage={setFrontImage}
        setBackImage={setBackImage}
        positions={positions}
        setPositions={setPositions}
      />
    </div>
  );
}
