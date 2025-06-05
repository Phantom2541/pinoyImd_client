import { currency } from "../../../services/utilities";

const Header = ({ options, total }) => {
  const { name, dateRange, address, due } = options;
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-between "
        style={{ borderTop: "1px solid black" }}
      >
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Name: </h6>
          <h6 className="ml-1">{name?.toUpperCase()}</h6>
        </div>
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">From: </h6>
          <h6 className="ml-1">{dateRange}</h6>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-between "
        style={{ borderTop: "1px solid black" }}
      >
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Address: </h6>
          <h6 className="ml-1">{address}</h6>
        </div>
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Due Date: </h6>
          <h6 className="ml-1">{due}</h6>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-center  "
        style={{ borderTop: "1px solid black", marginBottom: "-0.3rem" }}
      >
        <div className="d-flex align-items-center mt-2">
          <h6 className="fw-bold">Total Amount: </h6>
          <h5 className="ml-1">{currency(total)}</h5>
        </div>
      </div>
    </div>
  );
};

export default Header;
