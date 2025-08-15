import Body from "./body";
import Banner from "./banner";
import Header from "./header";
import Footer from "./footer";
import { useEffect, useState } from "react";
import "./style.css";
const DrugTestPrintout = () => {
  const [task, setTask] = useState({});

  useEffect(() => {
    setTask(JSON.parse(localStorage.getItem("taskPrintout")));
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
      document.head.removeChild(style);
    };
  }, []);
  if (!task._id) return "";
  return (
    <div
      className="bg-white d-flex justify-content-center drugtest-printout-container "
      style={{ paddingTop: "1px", width: "62rem" }}
    >
      <div className="mt-3">
        <h5 style={{ fontWeight: 500, marginBottom: "1px" }}>El</h5>
        <div className="ml-3">
          <Banner task={task} />
          <div style={{ width: "55rem" }}>
            <Header task={task} />
            <Body task={task} />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugTestPrintout;
