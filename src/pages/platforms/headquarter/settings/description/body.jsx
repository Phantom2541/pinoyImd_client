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
import Logo from "../logo";
import "./style.css";

export default function DescriptionBody() {
  const { addToast } = useToasts();
  const { token, message, isSuccess, activePlatform } = useSelector(
    ({ auth }) => auth
  );

  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;

  const [isValueFocused, setIsValueFocused] = useState(false);
  const [description, setDescription] = useState(companyId?.description || "");
  const [tagline, setTagline] = useState(companyId?.tagline || "");
  const [mission, setMission] = useState(companyId?.ms || "");
  const [vision, setVision] = useState(companyId?.vs || "");
  const [value, setValue] = useState(
    Array.isArray(companyId?.vl)
      ? companyId?.vl.join("\n")
      : companyId?.vl || ""
  );
  const [contacts, setContacts] = useState(
    companyId?.contacts || { email: "", mobile: "" }
  );
  const [address, setAddress] = useState(
    branch?.address || {
      street: "",
      barangay: "",
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
          name: companyId?.name,
          tagline,
          description,
          ms: mission,
          vs: vision,
          vl: valueArray,
          contacts,
          address,
        },
        // token,
      })
    ).then(() => {
      const updatedCompany = {
        ...companyId,
        tagline,
        description,
        ms: mission,
        vs: vision,
        vl: valueArray,
        contacts,
        address,
      };

      // dispatch(SetCOMPANY(updatedCompany));

      dispatch(
        SetActivePlatform({
          data: {
            ...activePlatform,
            branch: {
              ...branch,
              companyId: updatedCompany,
            },
          },
          isBranch: true,
        })
      );

      setIsLoading(false);
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
    <div className="companyDescription-container">
      <form onSubmit={handleUpdate}>
        <div className="companyDescription-header">
          <Logo />
          <div className="companyDescription-header-wrapper">
            <span className="companyDescription-name">{companyId?.name}</span>
            <div className="companyDescription-address">
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
            <div className="d-flex" style={{ gap: "20px" }}>
              <MDBInput
                type="text"
                label="Email"
                className="pb-0"
                style={{ minWidth: "300px" }}
                value={contacts?.email}
                onChange={({ target }) =>
                  setContacts({ ...contacts, email: target.value })
                }
                required
              />
              <MDBInput
                type="text"
                label="Phone Number"
                className="pb-0"
                value={contacts?.mobile}
                onChange={({ target }) =>
                  setContacts({ ...contacts, mobile: target.value })
                }
                required
              />
            </div>
          </div>
        </div>
        <div className="companyDescription-body">
          <MDBInput
            type="textarea"
            label="Enter Company description here..."
            className="pb-0"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            required
          />
          <MDBInput
            type="textarea"
            label="Enter Company tagline here..."
            className="pb-0"
            rows={tagline.split("\n").length || 1}
            value={tagline}
            onChange={({ target }) => setTagline(target.value)}
            required
          />
          <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <div className="w-100">
              <MDBInput
                type="textarea"
                label="Enter mission here...."
                className="pb-0"
                rows={mission.split("\n").length || 1}
                value={mission}
                onChange={({ target }) => setMission(target.value)}
                required
              />
            </div>
            <div className="w-100">
              <MDBInput
                type="textarea"
                label="Enter vision here...."
                className="pb-0"
                rows={vision.split("\n").length || 1}
                value={vision}
                onChange={({ target }) => setVision(target.value)}
                required
              />
            </div>
          </div>

          <div className="w-100 d-flex" style={{ gap: "20px" }}>
            <div className="w-100">
              <MDBInput
                type="textarea"
                label="Enter core values (one per line)..."
                className="pb-0"
                value={value}
                onChange={({ target }) => setValue(target.value)}
                onFocus={() => setIsValueFocused(true)}
                onBlur={() => setIsValueFocused(false)}
                required
              />
            </div>

            {isValueFocused && (
              <div
                className="mt-2 w-100"
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
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <MDBBtn
            size="md"
            className=" mt-3"
            color="primary"
            type="submit"
            disabled={isLoading}
            title="Update Description"
          >
            <MDBIcon icon="pencil-alt" />
            {isLoading && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        </div>
      </form>
    </div>
  );
}
