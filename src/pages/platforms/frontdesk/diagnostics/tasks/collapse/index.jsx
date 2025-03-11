import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
} from "mdbreact";
import {
  capitalize,
  fullName,
  getAge,
  getGenderIcon,
  handlePagination,
  sourceColor,
} from "../../../../../../services/utilities";
import CollapseBody from "./body";
import { Categories } from "../../../../../../services/fakeDb";
import { useHistory } from "react-router-dom";
// import { SetSELECTED } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function TasksCollapse({ page }) {
  const [activeId, setActiveId] = useState(-1),
    { maxPage } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ validator }) => validator),
    history = useHistory();
  // dispatch = useDispatch();

  const handeSelected = (menu, index) => {
    // dispatch(SetSELECTED(menu));
    setActiveId((prev) => (prev === index ? -1 : index));
  };

  return (
    <MDBContainer style={{ minHeight: "500px" }} fluid className="md-accordion">
      {handlePagination(filtered, page, maxPage).map((menu, index) => {
        const { customerId, category, source, _id = "" } = menu,
          categoryName =
            category === "walkin"
              ? "Walkin"
              : Categories.find(({ abbr }) => abbr === category)?.name;

        return (
          <MDBCard key={_id}>
            <MDBCollapseHeader>
              {index + 1}. {getGenderIcon(customerId?.isMale)}{" "}
              {fullName(customerId?.fullName)} |
              <span style={{ color: "blue" }}>{getAge(customerId?.dob)}</span>
              <MDBBadge color={sourceColor(categoryName)} className="mx-2">
                {categoryName}
              </MDBBadge>
              <MDBBadge
                onClick={() =>
                  history.push(
                    `/transactions/reports?patient=${customerId?._id}`
                  )
                }
                color="info"
                className="px-2"
              >
                <MDBIcon icon="eye" />
              </MDBBadge>
              {source && (
                <MDBBadge color="warning">{capitalize(source?.name)}</MDBBadge>
              )}
              <i
                onClick={() => handeSelected(menu, index)}
                style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                className="fa fa-angle-down transition-all"
              />
            </MDBCollapseHeader>
            <MDBCollapse id={`collapse-${index}`} isOpen={index === activeId}>
              <MDBCardBody className="pt-0">
                <CollapseBody menu={menu} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
