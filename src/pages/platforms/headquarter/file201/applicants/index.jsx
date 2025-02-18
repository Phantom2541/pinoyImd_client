import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/applicants";
import { MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "../../../../../components/topHeader";
import Table from "./table";
import Swal from "sweetalert2";
import { fullName, globalSearch } from "../../../../../services/utilities";

const Applicants = () => {
  const { token, onDuty } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ applicants }) => applicants),
    [category, setCategory] = useState("Petition"),
    [didSearch, setDidSearch] = useState(false),
    [baseApplicants, setBaseApplicants] = useState([]),
    [applicants, setApplicants] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (onDuty?._id) {
      dispatch(BROWSE({ token, branchId: onDuty._id }));
    }
  }, [token, dispatch, onDuty]);

  useEffect(() => {
    const filteredApplicants = collections.filter(
      ({ status }) => status === category.toLowerCase()
    );
    setBaseApplicants(filteredApplicants);
    setApplicants(filteredApplicants);
  }, [category, collections]);

  const handleApprove = (applicant) => {
    const { user } = applicant;
    Swal.fire({
      title: "Are you sure?",
      text: `You want to approve ${fullName(user.fullName)}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: { status: "approved", _id: applicant._id },
          })
        );

        Swal.fire({
          title: "Success!",
          text: "Applicant has been approved.",
          icon: "success",
        });
      }
    });
  };

  const handleReject = (applicant) => {
    Swal.fire({
      title: "Enter your reason",
      input: "textarea",
      icon: "question",
      inputPlaceholder: "Type your reason here...",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Deny",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Reason is required");
        }
        return value;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        dispatch(
          UPDATE({
            token,
            data: { _id: applicant._id, reason, status: "denied" },
          })
        );

        Swal.fire({
          title: "Success!",
          text: "Applicant has been approved.",
          icon: "success",
        });
      }
    });
  };

  const handleSearch = () => {
    const searchValue = document.getElementById("search").value;
    const searchResults = globalSearch(baseApplicants, searchValue);
    setApplicants(didSearch ? baseApplicants : searchResults);
    setDidSearch(!didSearch);
  };

  return (
    <>
      <MDBCard narrow>
        <TopHeader
          title="Applicant List"
          handleSearch={handleSearch}
          categories={["Petition", "Denied"]}
          setCategory={setCategory}
          category={category}
          hasCategory={true}
          didSearch={didSearch}
        />
        <MDBCardBody>
          <Table
            applicants={applicants}
            handleReject={handleReject}
            didSearch={didSearch}
            handleApprove={handleApprove}
          />
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Applicants;
