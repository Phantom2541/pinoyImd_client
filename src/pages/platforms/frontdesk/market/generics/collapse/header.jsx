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
    <div
      className={`d-flex justify-content-between ${textColor} text-capitalize `}
    >
      {index + 1}. {name}
      <div style={{ textTransform: "capitalize" }}>{drugClass}</div>
      <div className={`text center ${textColor} `}>{SystemTarget} System</div>
      <div className="d-flex">
        <small className="mr-2 mt-1"></small>
        <span
          className={`text-white mr-3 ${bgClass}`}
          style={{ borderRadius: "10px", padding: "3.5px 10px" }}
        >
          {status}
        </span>

        <div>
          <MDBBtn color="primary" size="sm" rounded onClick={handleAdd}>
            <MDBIcon icon="pencil-alt" />
          </MDBBtn>
        </div>
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
