import React from "react";
import { MDBRow, MDBCol, MDBInput } from "mdbreact";

export default function Others({ handleChange, handleValue }) {
  return (
    <>
      <MDBRow>
        {/* ✅ Is Profile */}
        <MDBCol md="6">
          <label title="Kapag 'Yes', ito ay isang bundled/grouped test (profile like LFT, Lipid Panel)">
            Is Profile
          </label>
          <select
            value={handleValue("isProfile")}
            onChange={(e) =>
              handleChange("isProfile", e.target.value === "true")
            }
            className="mb-0 form-control"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </MDBCol>

        {/* ✅ On Promo */}
        <MDBCol md="6">
          <label title="Indicates if this service has a promo/discount applied automatically">
            On Promo
          </label>
          <select
            value={handleValue("onPromo")}
            onChange={(e) => handleChange("onPromo", e.target.value === "true")}
            className="mb-0 form-control"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </MDBCol>

        {/* ✅ Discountable */}
        <MDBCol md="6">
          <label title="Kapag 'Yes', puwedeng i-apply ang senior, PWD, o manual discount">
            Discountable
          </label>
          <select
            value={handleValue("hasDiscount")}
            onChange={(e) =>
              handleChange("hasDiscount", e.target.value === "true")
            }
            className="mb-0 form-control"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </MDBCol>

        {/* ✅ Has Reseco */}
        <MDBCol md="6">
          <label title="May cutoff ba ng referral fee? Kapag 'Yes', may reseco system na sinusunod">
            Has Reseco (Referral Cutoff)
          </label>
          <select
            value={handleValue("hasReseco")}
            onChange={(e) =>
              handleChange("hasReseco", e.target.value === "true")
            }
            className="mb-0 form-control"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </MDBCol>

        {/* ✅ Refund */}
        <MDBCol md="6">
          <MDBInput
            type="number"
            label="Refund"
            title="Halaga ng ibinabalik sa pasyente kung sakaling i-cancellation"
            value={handleValue("refund")}
            onChange={(e) => handleChange("refund", e.target.value)}
          />
        </MDBCol>

        {/* ✅ Promo Amount */}
        <MDBCol md="6">
          <MDBInput
            type="number"
            label="Promo"
            title="Amount of promo discount applied (e.g. 100 pesos only)"
            value={handleValue("promo")}
            onChange={(e) => handleChange("promo", e.target.value)}
          />
        </MDBCol>
      </MDBRow>
    </>
  );
}
