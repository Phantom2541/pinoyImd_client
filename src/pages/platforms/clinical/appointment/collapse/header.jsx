import { MDBBtn } from "mdbreact";
import { properFullname } from "../../../../../services/utilities";
import { useSelector } from "react-redux";
import Months from "../../../../../services/fakeDb/calendar/months";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { physician } = useSelector(({ appointments }) => appointments);

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div className="d-flex align-items-center">
        {physician === "all" && (
          <>
            <span className="">
              Dr. {properFullname(item?.doctor?.fullName)}{" "}
            </span>
            <span className="mx-2">-</span>
          </>
        )}
        <span>{`${Months[item.month]} ${item.day}, ${item.year}`}</span>
      </div>
      <div className="d-flex">
        <small className={`mr-2 mt-1 `} style={{ fontWeight: 500 }}>
          {item?.patients?.length} - Appointments
        </small>
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
