import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SetSELECTED as SetVALIDATOR } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Categories } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBCollapseHeader, MDBIcon } from "mdbreact";
import {
  capitalize,
  fullName,
  getAge,
  getGenderIcon,
  sourceColor,
} from "../../../../../../services/utilities";

const Header = ({ deal, index }) => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { activeCOLAPSE, activePage } = useSelector(({ validator }) => validator),
    { customerId, category, source } = deal,
    history = useHistory(),
    dispatch = useDispatch(),
    categoryName =
      category === "wi"
        ? "Walkin"
        : Categories.find(({ abbr }) => abbr === category)?.name;

  return (
    <MDBCollapseHeader>
      {(activePage - 1) * maxPage + index + 1}.{" "}
      {getGenderIcon(customerId?.isMale)} {fullName(customerId?.fullName)} |
      <span style={{ color: "blue" }}>{getAge(customerId?.dob)}</span>
      <MDBBadge color={sourceColor(categoryName)} className="mx-2">
        {categoryName}
      </MDBBadge>
      {source && (
        <MDBBadge color="warning">{capitalize(source?.name)}</MDBBadge>
      )}
      {/* on the right corner */}
      <MDBBadge
        onClick={() => {
          localStorage.setItem(`customerId`, JSON.stringify(customerId));

          history.push(
            `/frontdesk/diagnostics/reports?patient=${customerId?._id}`
          );
        }}
        color="info"
        className="px-2"
      >
        <MDBIcon icon="eye" />
      </MDBBadge>
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
