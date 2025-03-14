import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SetDEAL } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
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
  const { activeDeal } = useSelector(({ validator }) => validator),
    { customerId, category, source } = deal,
    history = useHistory(),
    dispatch = useDispatch(),
    categoryName =
      category === "walkin"
        ? "Walkin"
        : Categories.find(({ abbr }) => abbr === category)?.name;

  return (
    <MDBCollapseHeader>
      {index + 1}. {getGenderIcon(customerId?.isMale)}{" "}
      {fullName(customerId?.fullName)} |
      <span style={{ color: "blue" }}>{getAge(customerId?.dob)}</span>
      <MDBBadge color={sourceColor(categoryName)} className="mx-2">
        {categoryName}
      </MDBBadge>
      {source && (
        <MDBBadge color="warning">{capitalize(source?.name)}</MDBBadge>
      )}
      {/* on the right corner */}
      <MDBBadge
        onClick={() =>
          history.push(`/transactions/reports?patient=${customerId?._id}`)
        }
        color="info"
        className="px-2"
      >
        <MDBIcon icon="eye" />
      </MDBBadge>
      <MDBBadge
        onClick={() =>
          history.push(`/transactions/reports?patient=${customerId?._id}`)
        }
        color="info"
        className="px-2"
      >
        <MDBIcon icon="eye" />
      </MDBBadge>
      <i
        onClick={() =>
          dispatch(
            SetDEAL({ deal, activeDeal: activeDeal === index ? -1 : index })
          )
        }
        style={{ rotate: `${activeDeal === index ? 0 : 90}deg` }}
        className="fa fa-angle-down transition-all"
      />
    </MDBCollapseHeader>
  );
};

export default Header;
