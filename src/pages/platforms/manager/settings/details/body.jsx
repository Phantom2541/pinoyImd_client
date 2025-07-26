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
import { RESET } from "../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../../../../services/redux/slices/assets/branches";
import AddressSelect from "../../../../../components/searchables/addressSelect";
import Swal from "sweetalert2";
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";

export default function BranchDescription() {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const { activePlatform, token, message, isSuccess } = useSelector(
    ({ auth }) => auth
  );

  const branch = activePlatform?.branch || {};
  const companyId = branch?.companyId || {};
  const companyName = companyId?.name || "Default";

  const [branchName, setBranchName] = useState(branch?.name || "");
  const [contacts, setContacts] = useState(
    branch?.contacts || { email: "", mobile: "", person: "" }
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

  const logo = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/profile/logo.png`;

  console.log("logo", logo);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [message, isSuccess, addToast, dispatch]);

  const handleChange = (_, value) => {
    setAddress(value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setIsLoading(true);

    dispatch(
      UPDATE({
        data: {
          _id: branch?._id,
          name: branchName,
          contacts,
          address,
        },
        token,
      })
    ).then(() => {
      const updatedBranch = {
        ...branch,
        name: branchName,
        contacts,
        address,
      };

      dispatch(
        SetActivePlatform({
          data: updatedBranch,
          isBranch: true,
        })
      );

      setIsLoading(false);
      Swal.fire({
        title: "Success!",
        text: "Branch Information Successfully Updated.",
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
            <h5 className="font-weight-bold text-center">{companyName}</h5>
            <img
              src={logo}
              className="mx-auto img-fluid d-block"
              alt={companyName}
              onError={(e) => (e.target.src = FailedLogo)}
            />
          </MDBView>
          <hr />
          <form onSubmit={handleUpdate}>
            <MDBInput
              type="text"
              label="Branch Name"
              value={branchName}
              onChange={({ target }) => setBranchName(target.value)}
              required
            />

            <MDBRow>
              <MDBCol md="4">
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
              <MDBCol md="4">
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
              <MDBCol md="4">
                <MDBInput
                  type="text"
                  label="Contact Person"
                  value={contacts.person}
                  onChange={({ target }) =>
                    setContacts({ ...contacts, person: target.value })
                  }
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
              title="Update Branch Info"
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
