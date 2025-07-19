import { MDBBtn } from "mdbreact";
import { currency } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_BULK_SOA } from "../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import Swal from "sweetalert2";

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
  const { vendor } = useSelector(({ onBoardings }) => onBoardings),
    dispatch = useDispatch();

  const handleCheckAll = () => {
    if (!isChecked) setActiveId(index);
    const havePrice = [...deals].every(({ up }) => up);
    if (!havePrice)
      return Swal.fire({
        icon: "warning",
        title: "Cannot proceed with Check All",
        html: `
          <p><strong>Date:</strong> ${title}</p>
          <p>Some of the deals for this date have no price:</p>
          <p>Please review and make sure all deals have a valid price before proceeding.</p>
          `,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    dispatch(CHECK_BULK_SOA({ date: title, deals }));
  };
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
              onChange={() => handleCheckAll()}
            />
            <label htmlFor={index} className="form-check-label label-table" />
          </>
        )}
        {index + 1}. {title}| {currency.format(sum)}
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
