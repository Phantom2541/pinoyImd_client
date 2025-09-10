import { MDBCol, MDBListGroup, MDBListGroupItem } from "mdbreact";
import { useState } from "react";
import BodySwitcher from "./bodySwitcher";
import { useSelector } from "react-redux";

const Request = () => {
  const { selected } = useSelector(({ kiosk }) => kiosk);
  const { haveCard = false } = selected;
  const [active, setActive] = useState("form");
  return (
    <MDBCol md="4">
      <div style={{ border: "2px solid black" }} className="p-2">
        <MDBListGroup
          style={{ height: "40px", overflowX: "auto", whiteSpace: "nowrap" }}
          className="d-flex flex-row"
        >
          {["form", ...(haveCard ? ["card", "id"] : [])].map((text, index) => {
            const baseText = text === "id" ? "Valid ID" : text;
            const isActive = active === text;
            return (
              <MDBListGroupItem
                onClick={() => setActive(text)}
                key={index}
                style={{ minWidth: "100px" }}
                className={`d-flex justify-content-center text-center  align-items-center rounded py-2 mx-2 h-100 cursor-pointer ${
                  isActive && "bg-primary text-white"
                }`}
              >
                <span className="fw-bold ">{baseText.toUpperCase()}</span>
              </MDBListGroupItem>
            );
          })}
        </MDBListGroup>
        <div className="mt-3 d-flex justify-content-center">
          <BodySwitcher active={active} />
        </div>
      </div>
    </MDBCol>
  );
};

export default Request;
