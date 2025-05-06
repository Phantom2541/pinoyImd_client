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
  const date = new Date(title);
  console.log("date", date);

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div className="d-flex align-items-center">
        <label
          htmlFor={index}
          className={`form-check-label label-table ${
            [0, 6].includes(date.getDay()) ? "text-primary" : ""
          }`}
        >
          {index + 1}. {date.toDateString()}
        </label>
        |
        <span className={`${!isOpen && "text-primary"} ml-1 mt-1`}>
          {currency(sum)}
        </span>
      </div>
      <div className="d-flex">
        <small className="mr-2 mt-1">{count} deal/s</small>
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
