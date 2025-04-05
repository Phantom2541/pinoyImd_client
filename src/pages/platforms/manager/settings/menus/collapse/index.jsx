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
import CollapseTable from "./body";

export default function MenuCollapse({
  menus,
  page,
  resetSearch,
  searchKey,
  handleUpdate,
}) {
  const [activeId, setActiveId] = useState(-1);
  const { maxPage } = useSelector(({ auth }) => auth);

  const paginatedMenus = handlePagination(menus, page, maxPage);

  const toggleCollapse = (index) => {
    setActiveId((prev) => (prev === index ? -1 : index));
  };

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {paginatedMenus.map((menu, index) => {
        const { description, abbreviation, opd, packages, _id } = menu;

        const isOpen = index === activeId;

        return (
          <MDBCard key={`menu-${_id}`}>
            <MDBCollapseHeader className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{index + 1}.</strong>{" "}
                {description && `${capitalize(description)} | `}
                {abbreviation?.toUpperCase()} -{" "}
                <span className="text-primary">{currency(opd)}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <MDBIcon
                  icon="pencil-alt"
                  className="mr-3"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleUpdate(menu)}
                />
                <i
                  className={`fa fa-angle-down transition-all`}
                  style={{
                    rotate: isOpen ? "0deg" : "90deg",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleCollapse(index)}
                />
              </div>
            </MDBCollapseHeader>
            <MDBCollapse id={`collapse-${index}`} isOpen={isOpen}>
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
