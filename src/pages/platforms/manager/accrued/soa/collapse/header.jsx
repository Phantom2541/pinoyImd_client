import React from "react";
import { MDBBtn } from "mdbreact";
import { currency } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_BULK_SOA } from "../../../../../../services/redux/slices/commerce/pos/services/billing";

const Header = ({
  sum,
  count,
  title,
  isOpen,
  textColor,
  index,
  deals,
  isChecked = false,
  setActiveId = () => {},
}) => {
  const { vendor } = useSelector(({ billings }) => billings),
    dispatch = useDispatch();
  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div className="d-flex align-items-center">
        {vendor.soa && (
          <>
            <input
              className="form-check-input"
              type="checkbox"
              id={index}
              checked={isChecked}
              onChange={() => {
                if (!isChecked) setActiveId(index);
                dispatch(CHECK_BULK_SOA({ date: title, deals }));
              }}
            />
            <label htmlFor={index} className="form-check-label label-table" />
          </>
        )}
        {index + 1}. {title}| {currency(sum)}
      </div>
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
