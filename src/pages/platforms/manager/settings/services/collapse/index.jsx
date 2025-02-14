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
import { References } from "../../../../../../services/fakeDb/index";
import CollapseTable from "./table";

export default function ServiceCollapse({ services, page }) {
  const [activeId, setActiveId] = useState(0),
    { maxPage } = useSelector(({ auth }) => auth);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {handlePagination(services, page, maxPage)?.map(
        ({ id, name, abbreviation, template, preference }, index) => (
          <MDBCard key={`services-${index}`}>
            <MDBCollapseHeader
              onClick={() =>
                preference && setActiveId(prev => (prev === id ? 0 : id))
              }
            >
              {index + 1}. {capitalize(name)}
              {abbreviation && ` | ${abbreviation.toUpperCase()}`} - &nbsp;
              <span className="text-primary">
                {capitalize(References.forms[template])}
              </span>
              {preference && (
                <i
                  style={{ rotate: `${activeId === id ? 0 : 90}deg` }}
                  className="fa fa-angle-down transition-all"
                />
              )}
            </MDBCollapseHeader>
            {preference && (
              <MDBCollapse id={`collapse-${id}`} isOpen={id === activeId}>
                <MDBCardBody className="pt-0">
                  <CollapseTable id={id} preference={preference} />
                </MDBCardBody>
              </MDBCollapse>
            )}
          </MDBCard>
        )
      )}
    </MDBContainer>
  );
}
