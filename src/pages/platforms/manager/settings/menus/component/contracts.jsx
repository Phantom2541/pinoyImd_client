import React from "react";
import { MDBInput, MDBRow, MDBCol, MDBTabPane } from "mdbreact";

export default function Contracts({ form, handleChange, handleValue }) {
  // Helper function to calculate discounted price
  const calculateDiscount = (basePrice, discountPercentage) => {
    return basePrice - basePrice * discountPercentage;
  };

  return (
    <MDBTabPane tabId={"menu-1"}>
      <MDBRow>
        <MDBCol md="6">
          <MDBInput
            type="number"
            label="Health Maintenance Organization"
            value={handleValue("hmo")}
            onChange={(e) => handleChange("hmo", e.target.value.toLowerCase())}
            className="mb-0"
          />
        </MDBCol>
        {form?.hasDiscount && (
          <MDBCol md="6">
            <h5>Descriptive Discount :</h5>
            <h6>
              Silver (5%): {calculateDiscount(form?.opd, 0.05).toFixed(2)}
            </h6>
            <h6>Gold (10%): {calculateDiscount(form?.opd, 0.1).toFixed(2)}</h6>
            <h6>
              Platinum (15%): {calculateDiscount(form?.opd, 0.15).toFixed(2)}
            </h6>
            <h6>
              Diamond (20%): {calculateDiscount(form?.opd, 0.2).toFixed(2)}
            </h6>
            <h6>
              Crown (25%): {calculateDiscount(form?.opd, 0.25).toFixed(2)}
            </h6>
          </MDBCol>
        )}
      </MDBRow>
    </MDBTabPane>
  );
}
