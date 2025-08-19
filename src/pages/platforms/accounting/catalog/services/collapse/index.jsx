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
import CollapseTable from "./table";

export default function ServiceCollapse() {
  const { cluster, activePage, maxPage } = useSelector(
      ({ preferences }) => preferences
    ),
    [activeId, setActiveId] = useState(0);
  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      {handlePagination(cluster, activePage, maxPage)?.map(
        ({ id, name, abbreviation, references, preference }, index) => (
          <MDBCard key={`services-${index}`}>
            <MDBCollapseHeader
              onClick={() => {
                if (preference) {
                  setActiveId((prev) => (prev === id ? 0 : id));
                }
              }}
            >
              {(activePage - 1) * maxPage + index + 1}. {capitalize(name)}
              {abbreviation && ` | ${abbreviation.toUpperCase()}`}
              {preference && (
                <>
                  <span className="text-primary">
                    &nbsp; Preference : {capitalize(preference)}
                  </span>
                </>
              )}
              {preference && (
                <i
                  style={{
                    rotate: `${activeId === id ? 0 : 90}deg`,
                    transition: "transform 0.3s",
                  }}
                  className="fa fa-angle-down"
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
