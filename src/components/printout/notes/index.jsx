import { useEffect, useState } from "react";
import Request from "./request";
import Prescription from "./prescription";
import Certificate from "./certificate";
import Clearance from "./clearance";

const noteMap = {
  request: Request,
  prescription: Prescription,
  certificate: Certificate,
  clearance: Clearance,
};
const NotesPrintout = () => {
  const [note, setNote] = useState({});
  useEffect(() => {
    const ls = localStorage.getItem("note");
    if (ls) {
      setNote(JSON.parse(ls));
    }
  }, []);

  if (!note._id) return "Note not found.";
  const Note = noteMap[note.type];
  return <Note note={note} />;
};

export default NotesPrintout;
