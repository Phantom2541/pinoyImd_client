import { useSelector } from "react-redux";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";

export default function Printout() {
  const { branch } = useSelector(({ auth }) => auth.activePlatform);
  const { companyId, name } = branch;

  return (
    // <div style={{ backgroundColor: "white" }}>
    <div
      style={{
        width: "750px",
        height: "624px",
        cursor: "default",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
        fontSize: "18px",
      }}
      id="printableArea"
    >
      <Banner company={companyId.name} branch={name} />
      <Header />
      <Body />
    </div>
    // </div>
  );
}
