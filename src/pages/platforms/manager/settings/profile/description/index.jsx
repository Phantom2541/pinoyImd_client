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
import { ENDPOINT } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  SetCOMPANY,
} from "../../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE } from "../../../../../../services/redux/slices/assets/companies";
import { FailedLogo } from "../../../../../../services/utilities";
import Swal from "sweetalert2";

export default function Description() {
  const { addToast } = useToasts();
  const { company, token, message, isSuccess } = useSelector(
    ({ auth }) => auth
  );
  const dispatch = useDispatch();
  const [description, setDescription] = useState(""),
    [isLoading, setIsLoading] = useState(false);

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
    if (
      company?.description?.toLowerCase() === description?.toLowerCase() ||
      !description
    ) {
      return addToast("No changes found, skipping update.", {
        appearance: "warning",
      });
    }

    setIsLoading(true);
    dispatch(UPDATE({ data: { _id: company?._id, description }, token })).then(
      () => {
        setIsLoading(false);
        setDescription("");
        dispatch(SetCOMPANY({ ...company, description }));
        Swal.fire({
          title: "Success!",
          text: "Description Successfully Updated.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    );
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
