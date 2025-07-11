import React from "react";
import { MDBBtn } from "mdbreact";
import { useSelector } from "react-redux";
import {
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../../../../services/utilities";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { customerId, branchId } = item;
  const { collections } = useSelector(({ onBoardings }) => onBoardings);

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div>
        {index + 1}. {getGenderIcon(customerId?.isMale)}{" "}
        {fullName(customerId?.fullName)} |{getAge(customerId?.dob)}
      </div>
      <div className="d-flex">
        <small className="mr-2 mt-1">{branchId?.displayname}</small>
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
