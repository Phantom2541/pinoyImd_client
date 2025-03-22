import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBContainer } from "mdbreact";
import { handlePagination } from "../../../../../../services/utilities";
import Body from "./body";
import Header from "./header";

export default function DealCollapse() {
  const { maxPage } = useSelector(({ auth }) => auth),
    { filtered, activePage, activeCOLAPSE } = useSelector(
      ({ validator }) => validator
    );

  return ( 
    <MDBContainer style={{ minHeight: "500px" }} fluid className="md-accordion">
      {handlePagination(filtered, activePage, maxPage).map((deal, index) => {
        
        return (
          <MDBCard key={`deal-${index}`}>
            <Header deal={deal} index={index} />
            <MDBCollapse id={`collapse-${index}`} isOpen={index === activeCOLAPSE}>
              <MDBCardBody className="pt-0">
                <Body customer={deal.customerId} forms={deal.forms} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
