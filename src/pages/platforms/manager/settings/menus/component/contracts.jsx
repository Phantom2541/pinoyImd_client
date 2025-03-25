import React from "react";
import { MDBRow, MDBCol, MDBTabPane, MDBAlert, MDBBtn } from "mdbreact";

export default function Contracts({ form, handleChange }) {
  const calculateDiscount = (basePrice, discountPercentage) => {
    return basePrice - basePrice * discountPercentage;
  };

  return (
    <MDBTabPane tabId={"menu-1"} className="m-0 p-0">
      <MDBRow className="m-0 p-0">
        {!form?.hasDiscount ? (
          <MDBCol md="12">
            <MDBAlert color="warning" className="text-center p-2">
              <strong>Discounts are currently disabled.</strong> <br />
              Click the <strong>“Provide Discount”</strong> button to enable it.
              <br />
              <MDBBtn
                color="primary"
                size="sm"
                className="mt-2"
                onClick={handleChange("hasDiscount", true)}
              >
                Provide Discount
              </MDBBtn>
            </MDBAlert>
          </MDBCol>
        ) : (
          <MDBCol md="12" className="m-0 p-0">
            <h5 className="mb-2 font-weight-bold text-center">
              Descriptive Discounts:
            </h5>
            <MDBRow>
              {/* Left Column */}
              <MDBCol md="6">
                <h6 className="text-secondary">
                  🩶 Silver (5%): {calculateDiscount(form?.opd, 0.05).toFixed(2)}
                </h6>
                <h6 className="text-warning">
                  🟡 Gold (10%): {calculateDiscount(form?.opd, 0.1).toFixed(2)}
                </h6>
                <h6 className="text-light bg-dark p-1 rounded">
                  ⚪ Platinum (15%):{" "}
                  {calculateDiscount(form?.opd, 0.15).toFixed(2)}
                </h6>
                <h6 className="text-info">
                  🔹 Diamond (20%):{" "}
                  {calculateDiscount(form?.opd, 0.2).toFixed(2)}
                </h6>
              </MDBCol>

              {/* Right Column */}
              <MDBCol md="6">
                <h6 className="text-purple">
                  🟣 Crown (25%):{" "}
                  {calculateDiscount(form?.opd, 0.25).toFixed(2)}
                </h6>
                <h6 className="text-brown">
                  🟤 Titanium (30%):{" "}
                  {calculateDiscount(form?.opd, 0.3).toFixed(2)}
                </h6>
                <h6 className="text-dark">
                  ⚫ Obsidian (35%):{" "}
                  {calculateDiscount(form?.opd, 0.35).toFixed(2)}
                </h6>
                <h6 className="text-success">
                  🌈 Elysium (40%):{" "}
                  {calculateDiscount(form?.opd, 0.4).toFixed(2)}
                </h6>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        )}
      </MDBRow>
    </MDBTabPane>
  );
}
