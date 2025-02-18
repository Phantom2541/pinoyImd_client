import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalize,
  currency,
  fullName,
  handlePagination,
} from "../../../../../../services/utilities";
import CollapseTable from "./table";
import { Roles } from "../../../../../../services/fakeDb";

import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/personnels";

export default function MenuCollapse({ staffs, page, resetSearch, searchKey }) {
  const [activeId, setActiveId] = useState(-1);
  const { maxPage, token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(
      UPDATE({
        data: {
          _id: data._id,
          employment: {
            hos: data.employmentHor,
            soe: data.employmentSoe,
            pc: data.employmentPc,
            designation: data.employmentDesignation,
          },
          rate: {
            monthly: data.rateMonthly,
            cola: data.rateCola,
            daily: data.rateDaily,
          },
          contribution: {
            ph: data.contributionPh,
            pi: data.contributionPi,
            sss: data.contributionSss,
          },
        },
        token,
      })
    );
  };

  console.log("Roles:", Roles);

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {handlePagination(staffs, page, maxPage).map((staff, index) => {
        const { user, employment, status, rate, contribution, _id } = staff;

        const role = Roles.findById(
          Number(employment?.designation)
        )?.display_name;
        return (
          <MDBCard
            key={`staffs-${index}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={`${
                index === activeId
                  ? "bg-info text-white transition"
                  : "bg-white"
              } ${activeId === index ? "custom-header" : ""}`}
              style={{ borderRadius: "50%" }}
              onClick={() =>
                setActiveId((prev) => (prev === index ? -1 : index))
              }
            >
              <label className="d-flex justify-content-between">
                {index + 1}. {user && `${fullName(user?.fullName)} | `}
                {employment.designation && `${role}`}
                <small>
                  {employment.soe && `${employment.soe?.toUpperCase()} | `}
                  {status && status.toUpperCase()}
                  <i
                    style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                    className="fa fa-angle-down transition-all ml-2"
                  />
                </small>
              </label>
            </MDBCollapseHeader>
            <MDBCollapse
              id={`collapse-${index}`}
              className="mb-2"
              isOpen={index === activeId}
              style={{
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <MDBCardBody className="pt-2">
                <CollapseTable
                  employment={employment}
                  staff={staff}
                  rate={rate}
                  contribution={contribution}
                  _id={_id}
                  onSubmit={onSubmit} // Updated to pass handleSubmit as onSubmit
                />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
