import React from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBBtnGroup,
} from "mdbreact";
import { Services } from "../../../../../../../services/fakeDb";
import Swal from "sweetalert2";
import { fullName } from "../../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  DENY_ONBOARDING,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { isEmpty } from "lodash";
export default function Collapsable({ item }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ menus }) => menus),
    { sendouts, source, createdAt } = item,
    dispatch = useDispatch();

  const handleProcess = (deal) => {
    // const { servicesId } = deal.sendouts;
    // const matchesPackages = [...collections].filter(
    //   ({ packages, isProfile }) =>
    //     servicesId.every((id) => packages.includes(id)) && !isProfile
    // );

    // if (isEmpty(sendouts.foundMenus)) {
    //   return Swal.fire({
    //     icon: "warning",
    //     title: "No Matching Menu Found",
    //     html: `This request cannot be processed because there is no menu that offers the <b>${servicesId
    //       .map((id) => Services.getAbbr(id))
    //       .join(
    //         ", "
    //       )}</b> services. Please contact the administrator for assistance.`,
    //     confirmButtonColor: "#3085d6",
    //     confirmButtonText: "OK",
    //   });
    // }

    dispatch(SetSELECTED(deal));
  };

  const handleDeny = async (deal) => {
    const customer = fullName(item?.customerId?.fullName);
    const { value: reason } = await Swal.fire({
      title: `${customer}`,
      input: "textarea",
      inputLabel: "Reason for denial",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        "aria-label": "Reason",
      },
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    });

    if (reason) {
      dispatch(
        DENY_ONBOARDING({
          data: {
            _id: deal._id,
            isDenied: {
              at: new Date(),
              by: auth._id,
              reason,
            },
          },
          token,
        })
      );
      Swal.fire({
        icon: "success",
        title: "Request Denied",
        html: `The action for <b>${customer}</b> has been saved successfully.`,
      });
    }
  };

  return (
    <>
      <MDBTable bordered className="m-0 p-0">
        <MDBTableHead>
          <tr>
            <th>Sources</th>
            <th>Services</th>
            <th>Generated At</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <td className="fw-bold">{source?.displayname}</td>
            <td>
              <small>
                {sendouts?.servicesId
                  ?.map((id) => Services.getAbbr(id))
                  .join(", ")}
              </small>
            </td>
            <td>
              {`${new Intl.DateTimeFormat("default", {
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(createdAt || Date.now()))}`}
            </td>
            <td>
              <MDBBtnGroup>
                <MDBBtn
                  size="sm"
                  color="primary"
                  onClick={() => handleProcess(item)}
                >
                  Process
                </MDBBtn>
                <MDBBtn
                  size="sm"
                  color="danger"
                  onClick={() => handleDeny(item)}
                >
                  Deny
                </MDBBtn>
              </MDBBtnGroup>
            </td>
          </tr>
        </MDBTableBody>
      </MDBTable>
    </>
  );
}
