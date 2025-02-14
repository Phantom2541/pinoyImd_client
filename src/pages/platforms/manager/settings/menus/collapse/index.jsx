import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
} from "mdbreact";
import { useSelector } from "react-redux";
import {
  capitalize,
  currency,
  handlePagination,
} from "../../../../../../services/utilities";
import CollapseTable from "./table";

export default function MenuCollapse({
  menus,
  page,
  resetSearch,
  searchKey,
  handleUpdate,
}) {
  const [activeId, setActiveId] = useState(-1),
    { maxPage } = useSelector(({ auth }) => auth);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {handlePagination(menus, page, maxPage).map((menu, index) => {
        const { description, abbreviation, opd, packages, _id } = menu;
        return (
          <MDBCard key={`menus-${index}`}>
            <MDBCollapseHeader>
              {index + 1}. {description && `${capitalize(description)} | `}
              {abbreviation && `${abbreviation.toUpperCase()}`} - &nbsp;
              <span className="text-primary">{currency(opd)}</span>
              <i
                style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                className="fa fa-angle-down transition-all"
                onClick={() =>
                  setActiveId((prev) => (prev === index ? -1 : index))
                }
              />
              <MDBIcon
                icon="pencil-alt"
                style={{ color: `red` }}
                onClick={() => handleUpdate(menu)}
              />
            </MDBCollapseHeader>
            <MDBCollapse id={`collapse-${index}`} isOpen={index === activeId}>
              <MDBCardBody className="pt-0">
                <CollapseTable
                  searchKey={searchKey}
                  resetSearch={resetSearch}
                  setActiveId={setActiveId}
                  packages={packages}
                  menuId={_id}
                  menuDescription={description}
                  menuAbbreviation={abbreviation}
                />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
