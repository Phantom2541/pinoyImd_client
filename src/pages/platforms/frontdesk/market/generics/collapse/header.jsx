import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { SetEDIT } from "../../../../../../services/redux/slices/market/generics";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { name, status, drugClass, SystemTarget } = item,
    dispatch = useDispatch();

  const bgClass =
    status === "approved"
      ? "bg-success"
      : status === "banned"
      ? "bg-dark gray"
      : status === "pending"
      ? "bg-warning"
      : status === "halt"
      ? "bg-danger"
      : "bg-light";

  const handleAdd = () => dispatch(SetEDIT(item));

  return (
    <div className={`d-flex align-items-center ${textColor} text-capitalize`}>
      {/* Column 1: Number + Name */}
      <div style={{ flexBasis: "25%", flexShrink: 0 }}>
        {index + 1}. {name}
      </div>

      {/* Column 2: Drug Class */}
      <div
        style={{ flexBasis: "25%", flexShrink: 0, textTransform: "capitalize" }}
      >
        {drugClass}
      </div>

      {/* Column 3: System Target */}
      <div
        className={` ${textColor}`}
        style={{ flexBasis: "25%", flexShrink: 0 }}
      >
        {SystemTarget} System
      </div>

      {/* Buttons on the right */}
      <div
        style={{ flexBasis: "25%", flexShrink: 0 }}
        className="d-flex justify-content-between align-items-center"
      >
        <span
          className={`text-white mr-3 ${bgClass}`}
          style={{ borderRadius: "10px", padding: "3.5px 10px" }}
        >
          {status}
        </span>

        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <MDBBtn
            color="primary"
            className="p-0"
            onClick={handleAdd}
            style={{ width: "35px", aspectRatio: "1/1", borderRadius: "50%" }}
          >
            <MDBIcon icon="pencil-alt" />
          </MDBBtn>
          <MDBBtn
            size="sm"
            color="white"
            rounded
            onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
            className="m-0 p-0 transition-all"
            // style={{ width: isOpen ? "1.5rem" : "2rem" }}
            style={{ width: isOpen ? "1.5rem" : "2rem", height: "1.5rem" }}
          >
            <i
              style={{ rotate: `${isOpen ? 0 : 90}deg` }}
              className="fa fa-angle-down transition-all"
            />
          </MDBBtn>
        </div>
      </div>
    </div>
  );
};

export default Header;
