import React, { useState } from "react";
import {
  MDBBadge,
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
  fullName,
  handlePagination,
  sourceColor,
} from "../../../../../../services/utilities";
import CollapseTable from "./table";
import { Categories } from "../../../../../../services/fakeDb";
import { useHistory } from "react-router-dom";

export default function TasksCollapse({ tasks, page, resetSearch, searchKey }) {
  const [activeId, setActiveId] = useState(-1),
    { maxPage } = useSelector(({ auth }) => auth),
    history = useHistory();

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {handlePagination(tasks, page, maxPage).map((menu, index) => {
        //console.log("menu", menu);
        const { customerId, category, source, _id = "" } = menu,
          categoryName =
            category === "walkin"
              ? "Walkin"
              : Categories.find(({ abbr }) => abbr === category)?.name;
        return (
          <MDBCard key={_id}>
            <MDBCollapseHeader>
              {index + 1}. {fullName(customerId?.fullName)}
              <MDBBadge color={sourceColor(categoryName)} className="mx-2">
                {categoryName}
              </MDBBadge>
              <MDBBadge
                onClick={() =>
                  history.push(
                    `/transactions/tracker?patient=${customerId?._id}`
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
                onClick={() =>
                  setActiveId((prev) => (prev === index ? -1 : index))
                }
                style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                className="fa fa-angle-down transition-all"
              />
            </MDBCollapseHeader>
            <MDBCollapse id={`collapse-${index}`} isOpen={index === activeId}>
              <MDBCardBody className="pt-0">
                <CollapseTable menu={menu} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
