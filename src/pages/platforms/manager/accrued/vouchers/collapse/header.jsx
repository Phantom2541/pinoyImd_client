import React from "react";
import { MDBBtn } from "mdbreact";
import { currency } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_BULK } from "../../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = ({
  sum,
  count,
  title,
  isOpen,
  isChecked = false,
  textColor,
  index,
  setActiveId,
  deals,
}) => {
  const { vendor } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div className="d-flex align-items-center">
        {vendor?._id && vendor?._id !== "noSource" && (
          <>
            <input
              className="form-check-input"
              type="checkbox"
              id={index}
              checked={isChecked}
              onChange={() =>
                // dispatch(CHECK_BULK({ date: title, hasSelected: !isChecked }))
                dispatch(CHECK_BULK({ date: title, deals }))
              }
            />
            <label htmlFor={index} className="form-check-label label-table" />
          </>
        )}
        {index + 1}. {title} |{" "}
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
