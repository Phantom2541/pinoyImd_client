import { useSelector, useDispatch } from "react-redux";
import { SetSELECTED as SetVALIDATOR } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBBadge, MDBCollapseHeader } from "mdbreact";
import {
  capitalize,
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../../../services/utilities";

const Header = ({ deal, index }) => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { activeCOLAPSE, activePage } = useSelector(({ validator }) => validator),
    { customerId, branchId } = deal,
    { displayname = "", name = "" } = branchId,
    branchName = displayname || name,
    dispatch = useDispatch();

  return (
    <MDBCollapseHeader>
      {(activePage - 1) * maxPage + index + 1}.{" "}
      {getGenderIcon(customerId?.isMale)} {fullName(customerId?.fullName)} |
      <span style={{ color: "blue" }}>{getAge(customerId?.dob)}</span>
      <MDBBadge color="warning" className="ml-1">
        {capitalize(branchName)}
      </MDBBadge>
      {/* on the right corner */}
      <i
        onClick={() =>
          dispatch(
            SetVALIDATOR({
              deal,
              activeCOLAPSE: activeCOLAPSE === index ? -1 : index,
            })
          )
        }
        style={{ rotate: `${activeCOLAPSE === index ? 0 : 90}deg` }}
        className="fa fa-angle-down transition-all"
      />
    </MDBCollapseHeader>
  );
};

export default Header;
