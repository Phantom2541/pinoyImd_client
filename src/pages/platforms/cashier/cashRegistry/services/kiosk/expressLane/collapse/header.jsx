import { MDBBtn, MDBIcon } from "mdbreact";
import {
  fullName,
  getGenderIcon,
  getAge,
  dateFormat,
} from "../../../../../../../../services/utilities";
// import { useSelector } from "react-redux";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { pid, client, schedule, status } = item;

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div>
        {index + 1}. {getGenderIcon(pid?.isMale)} {fullName(pid?.fullName)} |
        <span className="mx-1"> {getAge(pid?.dob)}</span>
        {client?._id ? " | Sendout" : ` | ${dateFormat(schedule)}`}
        {status === "done" && (
          <MDBIcon icon="check" className="ml-2 text-success" />
        )}
      </div>
      <div className="d-flex">
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
