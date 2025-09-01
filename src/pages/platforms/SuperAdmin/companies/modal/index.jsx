import { useState, useEffect, useCallback } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBStepper,
  MDBStep,
} from "mdbreact";
import {
  TOGGLE,
  SAVE,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import Details from "./details";
import Branch from "./branch";
const _form = {
  ceo: "",
  name: "",
  subName: "",
  category: "diagnostic",
  tagline: "",
  isHiring: true,
  hasVerified: false,
  approved: true,
  address: { region: "REGION III (CENTRAL LUZON)", province: "NUEVA ECIJA" },
};
export default function Modal() {
  const { token, auth } = useSelector(({ auth }) => auth),
    {
      showModal: show,
      selected,
      collections = [],
      formSubmitted,
      isSuccess,
    } = useSelector(({ companies }) => companies),
    [form, setForm] = useState(_form),
    [branch, setBranch] = useState({
      isMain: true,
      category: "laboratory",
      address: { region: "REGION III (CENTRAL LUZON)" },
    }),
    [isDetails, setIsDetails] = useState(true),
    [isDuplicate, setIsDuplicate] = useState(false),
    [isDuplicateBranch, setIsDuplicateBranch] = useState(false),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);
  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      Swal.fire({
        title: "Success!",
        text: "Company has been successfully created.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      dispatch(RESET());
    }
  }, [show, dispatch, toggle, formSubmitted, isSuccess]);

  useEffect(() => {
    if (show) {
      setForm((prev) => ({ ...prev, name: selected.name }));
    }
  }, [show, selected]);

  const normalize = (value) =>
    value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");

  const validateName = (name) => {
    const isExist = [...collections].some(
      (branch) => normalize(branch.name) === normalize(name)
    );

    setIsDuplicate(isExist);
    setForm({ ...form, name });
  };

  const validateBranchName = (name) => {
    const allBranches = collections.flatMap((item) => item.branches || []);
    const isExist = allBranches.some(
      (branch) => normalize(branch.name) === normalize(name)
    );
    setIsDuplicateBranch(isExist);
    setBranch({ ...branch, name });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDetails) {
      setBranch((prev) => ({
        ...prev,
        address: form.address,
        category: form.category,
      }));
      return setIsDetails(!isDetails);
    }
    const { name, displayname } = branch;
    dispatch(
      SAVE({
        token,
        data: {
          company: form,
          branch: { ...branch, displayname: displayname ? displayname : name },
          authID: auth._id,
        },
      })
    );
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="code-branch" className="mr-2" />
        Register Company
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBStepper className="m-0 p-0 mt-n4">
          <MDBStep className={"active"}>
            <a>
              <span className="circle">1</span>
              <span className="label">Company Details</span>
            </a>
          </MDBStep>
          <MDBStep className={!isDetails ? "active" : ""}>
            <a>
              <span className="circle">2</span>
              <span className="label">Main Branch</span>
            </a>
          </MDBStep>
        </MDBStepper>
        <form onSubmit={handleSubmit} className="mt-n3">
          {isDetails ? (
            <Details
              isDuplicate={isDuplicate}
              form={form}
              validateName={validateName}
              setForm={setForm}
              branch={branch}
              setBranch={setBranch}
            />
          ) : (
            <Branch
              isDuplicate={isDuplicateBranch}
              validateName={validateBranchName}
              branch={branch}
              setBranch={setBranch}
            />
          )}
          {!isDetails && (
            <MDBBtn
              rounded
              className=" mt-4"
              type="submit"
              color="light"
              onClick={() => setIsDetails(!isDetails)}
            >
              Back
            </MDBBtn>
          )}
          <MDBBtn
            rounded
            className="float-right mt-4"
            type="submit"
            color="primary"
            disabled={
              (isDetails ? isDuplicate : isDuplicateBranch) || formSubmitted
            }
          >
            {!isDetails ? "Save" : "Next"}
            {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
