import { useState, useEffect } from "react";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";

const Printout = ({ resecos, platform, header }) => {
  const { branch } = platform;
  const { gross, rebate, source, physician, isMembership = false } = header;
  const [onloaded, setOnloaded] = useState(false);
  useEffect(() => {
    if (onloaded) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer); // cleanup para iwas memory leak
    }
  }, [onloaded]);

  return (
    <div className="bg-danger">
      <div
        className="bg-white"
        style={{
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <table>
          <thead>
            <th colSpan="4">
              <Banner
                company={branch?.companyId.name}
                branch={branch?.name}
                onloaded={onloaded}
                setOnloaded={setOnloaded}
                className="laboratory-banner"
              />
              <Header
                physician={physician}
                source={source}
                gross={gross}
                rebate={rebate}
              />
            </th>
          </thead>
          <tbody>
            <Body isMembership={isMembership} resecos={resecos} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ResecoPrintout() {
  const [resecos, setResecos] = useState([]),
    [platform, setPlatform] = useState({ _id: "" }),
    [header, setHeader] = useState({});

  useEffect(() => {
    setResecos(JSON.parse(localStorage.getItem("resecos")));
    setPlatform(JSON.parse(localStorage.getItem("activePlatform")));
    setHeader(JSON.parse(localStorage.getItem("header")));
  }, []);

  if (resecos?.lenght !== 0)
    return <Printout resecos={resecos} platform={platform} header={header} />;

  return <div>Task is Empty</div>;
}
