import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBView,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { ENDPOINT, FailedLogo } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  SetCOMPANY,
  SetActivePlatform,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../../../../services/redux/slices/assets/companies";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import Swal from "sweetalert2";

export default function DescriptionBody() {
  const { addToast } = useToasts();
  const { token, message, isSuccess, activePlatform } = useSelector(
    ({ auth }) => auth
  );

  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;

  const [isValueFocused, setIsValueFocused] = useState(false);
  const [description, setDescription] = useState(companyId?.description || "");
  const [mission, setMission] = useState(companyId?.ms || "");
  const [vision, setVision] = useState(companyId?.vs || "");
  const [value, setValue] = useState(
    Array.isArray(companyId?.vl) ? companyId.vl.join("\n") : companyId?.vl || ""
  );
  const [contacts, setContacts] = useState(
    companyId?.contacts || { email: "", mobile: "" }
  );
  const [address, setAddress] = useState(
    branch?.address || {
      street: "",
      barangay: " ",
      city: "",
      province: "",
      region: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const logo = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/profile/logo.png`;

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleChange = (key, value) => {
    setAddress(value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const valueArray = value
      .split("\n")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    setIsLoading(true);
    dispatch(
      UPDATE({
        data: {
          _id: companyId?._id,
          description,
          mission,
          vision,
          vl: valueArray,
          contacts,
          address,
        },
        token,
      })
    ).then(() => {
      setIsLoading(false);

      const updatedCompany = {
        _id: companyId?._id,
        name: companyId?.name,
        subName: companyId?.subName,
        tagline: companyId?.tagline,
        hmo: companyId?.hmo,
        ms: mission,
        vs: vision,
        vl: valueArray,
        contacts,
        description,
        address,
        // include any other fields you rely on from companyId if needed
      };

      dispatch(SetCOMPANY(updatedCompany));

      dispatch(
        SetActivePlatform({
          data: updatedCompany,
          isHMO: false,
        })
      );

      Swal.fire({
        title: "Success!",
        text: "Description Successfully Updated.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    });
  };

  return (
    <div style={{ width: "900px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody>
          <MDBView>
            <h5 className="font-weight-bold">{companyId?.name}</h5>
            <img
              src={logo}
              className="mx-auto img-fluid"
              alt={companyId?.name || "Default Logo"}
              onError={(e) => (e.target.src = FailedLogo)}
            />
          </MDBView>
          <hr />
          <form onSubmit={handleUpdate}>
            <MDBInput
              type="textarea"
              label="Enter description here...."
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              style={{ minHeight: "200px" }}
              required
            />
            <MDBInput
              type="textarea"
              label="Enter mission here...."
              value={mission}
              onChange={({ target }) => setMission(target.value)}
              style={{ minHeight: "100px" }}
              required
            />
            <MDBInput
              type="textarea"
              label="Enter vision here...."
              value={vision}
              onChange={({ target }) => setVision(target.value)}
              style={{ minHeight: "100px" }}
              required
            />
            <MDBInput
              type="textarea"
              label="Enter core values (one per line)..."
              value={value}
              onChange={({ target }) => setValue(target.value)}
              onFocus={() => setIsValueFocused(true)}
              onBlur={() => setIsValueFocused(false)}
              style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
              required
            />

            {isValueFocused && (
              <div
                className="mt-2"
                style={{ paddingLeft: "10px", fontSize: "0.9rem" }}
              >
                <strong>Preview</strong>
                <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {value
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, idx) => {
                      const [title, ...rest] = line.split("–");
                      const detail = rest.join("–").trim();
                      return (
                        <li key={idx}>
                          <strong>{title.trim()}</strong>
                          {detail && ` – ${detail}`}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            <MDBRow className="mt-4">
              <MDBCol md="6">
                <MDBInput
                  type="text"
                  label="Email"
                  value={contacts.email}
                  onChange={({ target }) =>
                    setContacts({ ...contacts, email: target.value })
                  }
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  type="text"
                  label="Phone Number"
                  value={contacts.mobile}
                  onChange={({ target }) =>
                    setContacts({ ...contacts, mobile: target.value })
                  }
                  required
                />
              </MDBCol>
            </MDBRow>

            <div
              className="patient-personal-info address-grid mt-4"
              data-title="Address Information"
            >
              <AddressSelect address={address} handleChange={handleChange} />
              <div className="patient-form full-width">
                <span>Street (Optional)</span>
                <input
                  type="text"
                  value={address?.street || ""}
                  onChange={({ target }) =>
                    setAddress({ ...address, street: target.value })
                  }
                />
              </div>
            </div>

            <MDBBtn
              size="sm"
              className="float-right mt-3"
              rounded
              color="primary"
              type="submit"
              disabled={isLoading}
              title="Update Description"
            >
              <MDBIcon icon="pencil-alt" />
              {isLoading && <MDBIcon icon="spinner" pulse className="ml-2" />}
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
