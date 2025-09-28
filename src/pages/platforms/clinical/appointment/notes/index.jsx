import { useState, useEffect, useRef } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { useSelector } from "react-redux";
const Notes = ({ appointment }) => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { activePhysician } = useSelector(({ appointments }) => appointments);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handlePrint = (noteType) => {
    var width = "510";
    var height = "750";

    if (noteType === "prescription") {
      width = "410";
      height = "550";
    } else if (noteType === "request") {
      width = "510";
      height = "750";
    } else {
      width = "700";
      height = "530";
    }

    localStorage.setItem(
      "note",
      JSON.stringify({
        ...appointment,
        type: noteType,
        physician: activePhysician,
        branch: activePlatform.branch,
      })
    );
    window.open(
      "/printout/notes",
      "Notes Printout",
      `top=100px,left=100px,width=${width},height=${height}`
    );
  };

  return (
    <div className="d-inline-block position-relative" ref={popoverRef}>
      <MDBIcon
        icon="notes-medical"
        size="lg"
        className="ml-3 cursor-pointer"
        title="Printout Notes"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="position-absolute bg-white shadow rounded p-2 border border-primary note-container">
          <div className="note-triangle"></div>
          {[
            { label: "Request Form", value: "request" },
            { label: "Prescription", value: "prescription" },
            { label: "Medical Certificate", value: "certificate" },
            { label: "Medical Clearance", value: "clearance" },
          ].map(({ label, value }, index) => (
            <h6
              className="text-nowrap note-item"
              key={index}
              onClick={() => handlePrint(value)}
            >
              {label}
            </h6>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
