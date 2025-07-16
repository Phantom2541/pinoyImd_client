import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCollapse, MDBContainer, MDBCardBody } from "mdbreact";
import { handlePagination } from "../../../../../../services/utilities";
import Body from "./body";
import Header from "./header";

export default function DealCollapse() {
  const { maxPage } = useSelector(({ auth }) => auth),
    { filteredStatus, activePage, activeCOLAPSE } = useSelector(
      ({ validator }) => validator
    );

  return (
    <MDBCardBody className="pb-0">
      <MDBContainer
        style={{ minHeight: "500px" }}
        fluid
        className="md-accordion"
      >
        {handlePagination(filteredStatus, activePage, maxPage).map(
          (deal, index) => {
            const {
              _id,
              customerId,
              diagnostic,
              category,
              source,
              physicianId,
            } = deal;
            return (
              <MDBCard key={`deal-${index}`}>
                <Header deal={deal} index={index} />
                <MDBCollapse
                  id={`collapse-${index}`}
                  isOpen={index === activeCOLAPSE}
                >
                  <Body
                    _id={_id}
                    customer={customerId}
                    tasks={diagnostic}
                    category={category}
                    source={source}
                    referral={physicianId}
                  />
                </MDBCollapse>
              </MDBCard>
            );
          }
        )}
      </MDBContainer>
    </MDBCardBody>
  );
}
