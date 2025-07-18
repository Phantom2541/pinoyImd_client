import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
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
    <MDBContainer fluid style={{ minHeight: "300px" }}>
      {paginatedMenus.map((menu, index) => {
        const { description, abbreviation, opd, packages, _id } = menu;
        const isOpen = index === activeId;

        return (
          <MDBCard key={`menu-${_id}`} className="mb-2">
            <div
              onClick={() => toggleCollapse(index)}
              className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom"
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>{index + 1}.</strong>{" "}
                {description && `${capitalize(description)} | `}
                {abbreviation?.toUpperCase()} -{" "}
                <span className="text-primary">{currency.format(opd)}</span>
                <MDBIcon
                  icon="pencil-alt"
                  title="Edit Menus"
                  className="mr-3"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent collapse toggle
                    handleUpdate(menu);
                  }}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <MDBIcon
                  icon="angle-down"
                  className={`transition-all`}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </div>
            </div>
            <MDBCollapse isOpen={isOpen}>
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
