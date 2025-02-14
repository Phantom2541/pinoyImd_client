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
      {handlePagination(services, page, maxPage)?.map((service, index) => (
        <MDBCard key={`services-${index}`}>
          <MDBCollapseHeader
            onClick={() =>
              service?.preference &&
              setActiveId((prev) => (prev === service?.id ? 0 : service?.id))
            }
          >
            {index + 1}. {capitalize(service?.name)}
            {service?.abbreviation &&
              ` | ${service?.abbreviation.toUpperCase()}`}{" "}
            - &nbsp;
            <span className="text-primary">
              {capitalize(References.forms[service?.template])}
            </span>
            {service?.preference && (
              <i
                style={{ rotate: `${activeId === service?.id ? 0 : 90}deg` }}
                className="fa fa-angle-down transition-all"
              />
            )}
          </MDBCollapseHeader>
          <MDBCollapse
            id={`collapse-${service?.id}`}
            isOpen={service?.id === activeId}
          >
            <MDBCardBody className="pt-0">
              <CollapseTable id={service?.id} service={service} />
            </MDBCardBody>
          </MDBCollapse>
        </MDBCard>
      ))}
    </MDBContainer>
  );
}
