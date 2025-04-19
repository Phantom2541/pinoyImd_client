import React from "react";
import { MDBBtn } from "mdbreact";

const Header = ({ company = {}, isOpen, textColor, index, setActiveId }) => {
  const { name = "", subName = "" } = company;
  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      {index + 1}. {name} {subName}
      <div className="d-flex">
        <MDBBtn
          size="sm"
          color="white"
          rounded
          onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
          className="m-0 p-0 transition-all "
          style={{ width: isOpen ? "1.5rem" : "2rem" }}
        >
          <i
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all "
          />
        </MDBBtn>
      </div>
    </div>
  );
};

export default Header;
