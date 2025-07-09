import { currency, mobile } from "../../../services/utilities";

const Header = ({ options, total }) => {
  const {
    name,
    dateRange,
    address,
    due,
    customerCount,
    cp = {},
    isSource = true,
  } = options;
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
      {isSource ? (
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
      ) : (
        <div
          className="d-flex align-items-center justify-content-between "
          style={{ borderTop: "1px solid black" }}
        >
          <div className="d-flex align-items-center mt-1">
            <h6 className="fw-bold">Contact Person: </h6>
            <h6 className="ml-1">{cp.agent}</h6>
          </div>
          <div className="d-flex align-items-center mt-1">
            <h6 className="fw-bold">Contact Number: </h6>
            <h6 className="ml-1">{mobile(cp.phone)}</h6>
          </div>
        </div>
      )}
      <div
        className="d-flex align-items-center justify-content-between "
        style={{ borderTop: "1px solid black" }}
      >
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Number of Customers: </h6>
          <h6 className="ml-1">{customerCount}</h6>
        </div>
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Gross: </h6>
          <h6 className="ml-1">{currency.format(total)}</h6>
        </div>
      </div>
    </div>
  );
};

export default Header;
