import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";
import { useSelector } from "react-redux";
import {
  capitalize,
  handlePagination,
} from "../../../../../../services/utilities";
// import { References } from "../../../../../../services/fakeDb/index";
import CollapseTable from "./table";

export default function ServiceCollapse() {
  const [activeId, setActiveId] = useState(0),
    { maxPage } = useSelector(({ auth }) => auth),
    { filtered, activePage } = useSelector(({ preferences }) => preferences);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {handlePagination(filtered, activePage, maxPage)?.map(
        ({ id, name, abbreviation, references, preference }, index) => (
          <MDBCard key={`services-${index}`}>
            <MDBCollapseHeader
              onClick={() =>
                references && setActiveId((prev) => (prev === id ? 0 : id))
              }
            >
              {index + 1}. {capitalize(name)}
              {abbreviation && ` | ${abbreviation.toUpperCase()}`}
              <span className="text-primary"> Preference : {preference}</span>
              {references && (
                <i
                  style={{ rotate: `${activeId === id ? 0 : 90}deg` }}
                  className="fa fa-angle-down transition-all"
                />
              )}
            </MDBCollapseHeader>
            {references && (
              <MDBCollapse id={`collapse-${id}`} isOpen={id === activeId}>
                <MDBCardBody className="pt-0">
                  <CollapseTable
                    id={id}
                    references={references}
                    preference={preference}
                  />
                </MDBCardBody>
              </MDBCollapse>
            )}
          </MDBCard>
        )
      )}
    </MDBContainer>
  );
}
