import Header from "./header";
import Patient from "./patient";
import Body from "./body";
import Footer from "./footer";

export default function Prescription({ note }) {
  return (
    <div
      className="checkup-data-prescription-card"
      style={{ width: "4.25in", height: "5.5in" }}
    >
      <Header note={note} />
      <Patient note={note} />
      <Body note={note} />
      <Footer note={note} />
    </div>
  );
}
