import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SetSELECTED as SetVALIDATOR } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { Categories } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBCollapseHeader } from "mdbreact";
import {
  capitalize,
  fullName,
  getAge,
  getGenderIcon,
  sourceColor,
} from "../../../../../../services/utilities";

const Header = ({ deal, index, totalDeals }) => {
  const { maxPage } = useSelector(({ auth }) => auth),
    { activeCOLAPSE, activePage } = useSelector(({ validator }) => validator),
    { customerId, category, source } = deal,
    history = useHistory(),
    dispatch = useDispatch(),
    categoryName =
      category === "wi"
        ? "Walkin"
        : Categories.find(({ abbr }) => abbr === category)?.name;

  const allDone = Object.values(deal.diagnostic).every((section) => {
    if (Array.isArray(section)) {
      return section.every((item) => item.hasDone === true);
    } else {
      return section.hasDone === true;
    }
  });

  const displayIndex = totalDeals - ((activePage - 1) * maxPage + index);
  return (
    <div style={{ backgroundColor: allDone ? "rgba(255, 169, 0, 0.3)" : "" }}>
      <MDBCollapseHeader>
        {displayIndex}. {getGenderIcon(customerId?.isMale)}{" "}
        {fullName(customerId?.fullName)} |
        <span style={{ color: "blue" }}>{getAge(customerId?.dob)}</span>
        <MDBBadge color={sourceColor(categoryName)} className="mx-2">
          {categoryName}
        </MDBBadge>
        {source && (
          <MDBBadge color="warning" className="mr-2">
            {capitalize(source?.name)}
          </MDBBadge>
        )}
        <span
          style={{ fontSize: "22px", marginBottom: "-10px" }}
          title={`View the result history of ${fullName(customerId?.fullName)}`}
          onClick={() => {
            localStorage.setItem(`customerId`, JSON.stringify(customerId));

            history.push(
              `/frontdesk/diagnostics/reports?patient=${customerId?._id}`
            );
          }}
        >
          👀
        </span>
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
    </div>
  );
};

export default Header;
