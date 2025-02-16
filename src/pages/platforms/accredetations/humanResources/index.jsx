import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/assets/persons/personnels";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBView,
} from "mdbreact";
import { fullName } from "../../../../services/utilities";
import { Roles } from "../../../../services/fakeDb";

const HumanResources = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ personnels }) => personnels),
    [personnels, setPersonnels] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, branchId: "637097f0535529a3a57e933e" }));
  }, [token, dispatch]);

  useEffect(() => {
    setPersonnels(collections);
  }, [collections]);

  const handlePrintOut = () => {
    const { screen } = window;
    window.open(
      "/printout/personnel",
      "_blank",
      "width=" + screen.width + ",height=" + screen.height
    );

    localStorage.setItem("personnels", JSON.stringify(personnels));
  };
  return (
    <>
      <MDBCard className="pb-3" narrow>
        <MDBView
          cascade
          className="gradient-card-header blue-gradient py-2 mx-4 d-flex justify-content-between align-items-center"
        >
          <span className="ml-3 ">Personnel List</span>
          <MDBBtn size="sm" rounded color="info" onClick={handlePrintOut}>
            <MDBIcon icon="print" />
          </MDBBtn>
        </MDBView>

        <MDBCardBody>
          <MDBTable bordered>
            <MDBTableHead>
              <tr>
                <th rowSpan={2} className="text-center">
                  Name
                </th>
                <th rowSpan={2} className="text-center">
                  Designation/Position
                </th>
                <th rowSpan={2} className="text-center">
                  Highest
                  <br /> Educational
                  <br /> Attainment
                </th>
                <th rowSpan={2} className="text-center">
                  PRC Reg. No.
                </th>
                <th colSpan={2} className="text-center">
                  Valid
                </th>
                <th rowSpan={2} className="text-center">
                  Date of Birth <br />
                  (mm/dd/yy)
                </th>
              </tr>
              <tr>
                <th className="text-center">From</th>
                <th className="text-center">To</th>
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {personnels.length > 0 ? (
                personnels.map((personnel, index) => {
                  const { user, employment } = personnel;
                  const { prc = { id: "", from: "", to: "" } } = user;

                  return (
                    <tr key={`personnel-${index}`}>
                      <td>{fullName(user.fullName)}</td>
                      <td className="text-center">
                        {Roles.findById(employment.designation)?.name || ""}
                      </td>
                      <td>College (static)</td>
                      <td className="text-center">{prc.id}</td>
                      <td className="text-center">{prc.from}</td>
                      <td className="text-center">{prc.to}</td>
                      <td className="text-center">{user.dob}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No Record.</td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default HumanResources;
