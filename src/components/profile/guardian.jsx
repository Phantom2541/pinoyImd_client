import { MDBRow, MDBCol, MDBInput, MDBSwitch } from "mdbreact";
import { EditableUser, Select } from "../customizable";
import { getAge } from "../../services/utilities";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { UPDATE } from "../../services/redux/slices/assets/persons/auth";
import swal from "sweetalert2";

export default function Guardian({ handleChange, handleSubmit }) {
  const { auth, isSuccess, formSubmitted, token } = useSelector(
    ({ auth }) => auth,
  );
  const hasguardian = auth.guardian ? true : false;
  const [address, setAddress] = useState({});

  const dispatch = useDispatch();
  const { guardian = {} } = auth;

  useEffect(() => {
    if (auth) {
      const g = auth.guardian?.address || {};

      setAddress({
        region: g.region || "",
        province: g.province || "",
        city: g.city || "",
        barangay: g.barangay || "",
        street: g.street || "",
      });
    }
  }, [auth]);

  const fullAddress = [
    address.street,
    address.barangay,
    address.city,
    address.province,
    address.region,
  ]
    .filter(Boolean)
    .join(", ");

  const handleUpdate = (G_id) => {
    const data = { _id: auth._id, guardian: G_id };
    dispatch(UPDATE({ token, data }));
  };
  const handleOnUserNotFound = () => {
    swal.fire({
      icon: "info",
      title: "Guardian not registered",
      text: "Your guardian is not yet registered in the system. Please ask your guardian to complete registration (Sign-UP). Copy this link: http://localhost:3000/subscribers/636ab9ca4b154f3c30400829",
      confirmButtonText: "OK",
    });
  };

  return (
    <>
      {hasguardian && (
        <>
          <form onSubmit={handleSubmit}>
            <MDBRow>
              <MDBCol md="3">
                <MDBInput
                  disabled
                  type="text"
                  value={auth.guardian?.fullName?.fname?.toUpperCase() || ""}
                  onChange={(e) =>
                    handleChange(
                      "guardian.fullName.fname",
                      e.target.value.toUpperCase(),
                    )
                  }
                  label="First name"
                />
              </MDBCol>
              <MDBCol md="3" className="px-0">
                <MDBInput
                  disabled
                  type="text"
                  value={auth.guardian?.fullName?.mname?.toUpperCase() || ""}
                  onChange={(e) =>
                    handleChange("fullName", {
                      ...auth.guardian.fullName,
                      mname: e.target.value.toUpperCase(),
                    })
                  }
                  label="Middle name"
                />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput
                  type="text"
                  disabled
                  value={auth.guardian?.fullName?.lname?.toUpperCase() || ""}
                  onChange={(e) =>
                    handleChange("fullName", {
                      ...auth.guardian.fullName,
                      lname: e.target.value.toUpperCase(),
                    })
                  }
                  label="Last name"
                />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput
                  type="text"
                  value={auth?.guardian?.alias?.toUpperCase() || ""}
                  disabled
                  onChange={(e) => handleChange("alias", e.target.value)}
                  label="Alias"
                />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="4">
                <MDBInput
                  type="text"
                  value={auth.guardian?.fullName?.title?.toUpperCase() || ""}
                  disabled
                  onChange={(e) =>
                    handleChange("fullName", {
                      ...auth.guardian.fullName,
                      title: e.target.value,
                    })
                  }
                  label="Title"
                />
              </MDBCol>
              <MDBCol md="4" className="px-0">
                <MDBInput
                  type="text"
                  value={
                    auth.guardian?.fullName?.postnominal?.toUpperCase() || ""
                  }
                  disabled
                  onChange={(e) =>
                    handleChange("fullName", {
                      ...auth.guardian.fullName,
                      postnominal: e.target.value,
                    })
                  }
                  label="Postnominal"
                />
              </MDBCol>
              <MDBCol md="4" style={{ paddingTop: "2px" }}>
                <Select
                  label="Suffix"
                  preValue={auth.guardian?.fullName?.suffix || ""}
                  disabled
                  onChange={(e) =>
                    handleChange("fullName", {
                      ...auth.guardian.fullName,
                      suffix: e === "" ? "" : e,
                    })
                  }
                />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="3" style={{ paddingTop: "14px" }}>
                <MDBInput
                  type="date"
                  value={auth.guardian.dob || ""}
                  disabled
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="py-0"
                  label={`Birthdate (${getAge(auth.guardian.dob)})`}
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  type="email"
                  value={auth.guardian.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  label="E-mail Address"
                  disabled
                />
              </MDBCol>
              <MDBCol md="2">
                <MDBInput
                  type="text"
                  value={auth.guardian.mobile || ""}
                  disabled
                  onChange={(e) =>
                    handleChange("mobile", e.target.value.replace(/\D/g, ""))
                  }
                  label="Mobile"
                  maxLength={10}
                />
              </MDBCol>
              <MDBCol md="3" className="text-center">
                <MDBSwitch
                  checked={!!auth.guardian.isMale}
                  onChange={() => handleChange("isMale", !auth.guardian.isMale)}
                  labelLeft="Female"
                  labelRight="Male"
                  className="mt-4"
                  disabled
                />
              </MDBCol>
            </MDBRow>
            <label> Address:</label>

            <p>{fullAddress}</p>
          </form>
        </>
      )}
      {!hasguardian && (
        <>
          <label>Guardian: </label>
          <EditableUser
            user={guardian}
            placeHolder="Contact..."
            formSubmitted={formSubmitted}
            isSuccess={isSuccess}
            onSave={(G_id) => handleUpdate(G_id)}
            onUserNotFound={handleOnUserNotFound}
          />
        </>
      )}
    </>
  );
}
