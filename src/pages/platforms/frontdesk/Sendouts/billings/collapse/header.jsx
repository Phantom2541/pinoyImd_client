import React from "react";
import { MDBBtn } from "mdbreact";
import { fullName } from "../../../../../../services/utilities";

const Header = ({ deal, isOpen, textColor, index, setActiveId }) => {
  const { customerId } = deal;

  console.log("deal", deal);

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      {index + 1}. {fullName(customerId.fullName)}
      <div className="d-flex">
        <small className="mr-2 mt-1">xx </small>
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
