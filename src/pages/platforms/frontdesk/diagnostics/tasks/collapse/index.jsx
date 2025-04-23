import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCollapse, MDBContainer } from "mdbreact";
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
        const { _id, customerId, forms, category, source, physicianId } = deal;
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
                tasks={forms}
                category={category}
                source={source}
                referral={physicianId}
              />
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
