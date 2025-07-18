import React from "react";
import { MDBBtn } from "mdbreact";
import { currency } from "../../../../../../services/utilities";

const Header = ({
  sum,
  count,
  title,
  isOpen,
  textColor,
  index,
  setActiveId,
}) => {
  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      {index + 1}. {title}| {currency.format(sum)}
      <div className="d-flex">
        <small className="mr-2 mt-1">{count} sendout/s</small>
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
