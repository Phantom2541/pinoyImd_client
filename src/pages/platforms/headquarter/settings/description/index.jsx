import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBView,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { ENDPOINT } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  SetCOMPANY,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../../../../services/redux/slices/assets/companies";
import { FailedLogo } from "../../../../../services/utilities";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import Swal from "sweetalert2";

export default function Description() {
  const { addToast } = useToasts();
  const { company, token, message, isSuccess } = useSelector(
      ({ auth }) => auth
    ),
    [description, setDescription] = useState(""),
    [contacts, setContacts] = useState(
      company?.contacts || { email: "", mobile: "" }
    ),
    [address, setAddress] = useState(
      company?.address || {
        street: "",
        barangay: " ",
        city: "",
        province: "",
        region: "",
      }
    ),
    [isLoading, setIsLoading] = useState(false),
    dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleUpdate = (e) => {
    e.preventDefault();
    // const isSameDescription =
    //   (company?.description || "").toLowerCase().trim() ===
    //   (description || "").toLowerCase().trim();

    // const isSameEmail =
    //   (company?.contacts?.email || "").toLowerCase().trim() ===
    //   (contacts?.email || "").toLowerCase().trim();

    // const isSameMobile =
    //   (company?.contacts?.mobile || "").toLowerCase().trim() ===
    //   (contacts?.mobile || "").toLowerCase().trim();

    // if (isSameDescription && isSameEmail && isSameMobile) {
    //   return addToast("No changes found, skipping update.", {
    //     appearance: "warning",
    //   });
    // }

    setIsLoading(true);
    dispatch(
      UPDATE({
        data: { _id: company?._id, description, contacts, address },
        token,
      })
    ).then(() => {
      setIsLoading(false);
      dispatch(SetCOMPANY({ ...company, description, contacts, address }));
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
    <>
      <div style={{ width: "400px" }} className="mx-auto">
        <MDBCard>
          <MDBCardBody>
            <MDBView>
              <img
                src={`${ENDPOINT}/public/companies/${company.name}/logo.png`}
                className="mx-auto img-fluid"
                alt={company?.name || "Default Logo"}
                onError={(e) => (e.target.src = FailedLogo)}
              />
            </MDBView>
            <hr />
            <h5 className="font-weight-bold">{company?.name}</h5>
            <form onSubmit={handleUpdate}>
              <MDBInput
                type="textarea"
                label="Enter description here...."
                value={description || company?.description}
                onChange={({ target }) => setDescription(target.value)}
                style={{ minHeight: "200px" }}
                required
              />
              <MDBInput
                type="text"
                label="email"
                value={contacts.email}
                onChange={({ target }) =>
                  setContacts({ ...contacts, email: target.value })
                }
                required
              />
              <MDBInput
                type="text"
                label="Phone Number"
                value={contacts.mobile}
                onChange={({ target }) =>
                  setContacts({ ...contacts, mobile: target.value })
                }
                required
              />

              <div
                className="patient-personal-info address-grid mt-4"
                data-title="Address Information"
              >
                <AddressSelect address={address} handleChange={setAddress} />
                <div className="patient-form full-width">
                  <span>Street (Optional)</span>
                  <input
                    type="text"
                    value={company?.address?.street}
                    onChange={({ target }) =>
                      setAddress("address", {
                        ...address,
                        street: target.value,
                      })
                    }
                  />
                </div>
              </div>
              <MDBBtn
                size="sm"
                className="float-right"
                rounded
                color="primary"
                type="submit"
                disabled={isLoading}
                title="Update Tagline"
              >
                <MDBIcon icon="pencil-alt" />{" "}
                {isLoading && <MDBIcon icon="spinner" pulse className="ml-2" />}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </div>
    </>
  );
}
