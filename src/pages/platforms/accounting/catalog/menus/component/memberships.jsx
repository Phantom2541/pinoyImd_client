import React from "react";
import { MDBRow, MDBCol, MDBAlert, MDBBtn } from "mdbreact";

export default function Contracts({ form, handleChange }) {
  const calculateDiscount = (basePrice, discountPercentage) => {
    return basePrice - basePrice * discountPercentage;
  };

  return (
    <>
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
                onClick={() => handleChange("hasDiscount", true)}
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
                  <span role="img">(5%)</span>:{" "}
                  {calculateDiscount(form?.opd, 0.05).toFixed(2)}
                </h6>
                <h6 className="text-warning">
                  <span role="img" aria-label="Yellow circle emoji">
                    🟡
                  </span>{" "}
                  Gold (10%): {calculateDiscount(form?.opd, 0.1).toFixed(2)}
                </h6>
                <h6 className="text-light bg-dark p-1 rounded">
                  <span role="img" aria-label="White circle emoji">
                    ⚪
                  </span>
                  Platinum (15%):{" "}
                  {calculateDiscount(form?.opd, 0.15).toFixed(2)}
                </h6>
                <h6 className="text-info">
                  <span role="img" aria-label="blue diamond emoji">
                    🔹
                  </span>{" "}
                  Diamond (20%): {calculateDiscount(form?.opd, 0.2).toFixed(2)}
                </h6>
              </MDBCol>

              {/* Right Column */}
              <MDBCol md="6">
                <h6 className="text-purple">
                  <span role="img" aria-label="White circle emoji">
                    🟣
                  </span>
                  Crown (25%): {calculateDiscount(form?.opd, 0.25).toFixed(2)}
                </h6>
                <h6 className="text-brown">
                  <span role="img" aria-label="White circle emoji">
                    {" "}
                    🟤
                  </span>{" "}
                  Titanium (30%): {calculateDiscount(form?.opd, 0.3).toFixed(2)}
                </h6>
                <h6 className="text-dark">
                  <span role="img" aria-label="White circle emoji">
                    ⚫
                  </span>{" "}
                  Obsidian (35%):{" "}
                  {calculateDiscount(form?.opd, 0.35).toFixed(2)}
                </h6>
                <h6 className="text-success">
                  <span role="img" aria-label="White circle emoji">
                    {" "}
                    🌈
                  </span>{" "}
                  Elysium (40%): {calculateDiscount(form?.opd, 0.4).toFixed(2)}
                </h6>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        )}
      </MDBRow>
    </>
  );
}
