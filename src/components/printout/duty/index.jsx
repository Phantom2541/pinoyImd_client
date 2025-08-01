import { useEffect, useState } from "react";
import { Banner } from "../../../services/utilities";
import Body from "./body";
import "./style.css";
import Header from "./header";
const DutyPrintout = () => {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected(JSON.parse(localStorage.getItem("dutyPrintout")));
    // Delay to ensure content is rendered before print
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: landscape;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style); // clean up on unmount
    };
  }, []);
  return (
    <>
      <Banner
        className="laboratory-banner"
        company={selected?.branch?.companyId?.name}
        branch={selected?.branch?.name}
      />
      <Header selected={selected} />
      {selected._id && <Body selected={selected} />}
    </>
  );
};

export default DutyPrintout;
