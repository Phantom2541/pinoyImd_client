import React from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
} from "mdbreact";
import {
  dateFormat,
  fullName,
  mobile,
} from "../../../../../services/utilities";

const Table = ({
  applicants = [],
  didSearch = false,
  handleReject = () => {},
  handleApprove = () => {},
}) => {
  const style = {
    fontWeight: 400,
  };
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th rowSpan={2} className="text-center">
            Name
          </th>
          <th rowSpan={2} className="text-center">
            Mobile
          </th>
          <th rowSpan={2} className="text-center">
            HEA
          </th>
          <th colSpan={3} className="text-center">
            PRC
          </th>
          <th className="text-center" rowSpan={2}>
            Actions
          </th>
        </tr>
        <tr>
          <th className="text-center">ID</th>
          <th className="text-center">From</th>
          <th className="text-center">To</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {applicants.length > 0 ? (
          applicants.map((applicant) => {
            const { user } = applicant;
            const { fullName: name, mobile: phone, hea = "", prc } = user;
            const { id = "", from = "", to = "" } = prc || {};
            return (
              <tr key={applicant._id}>
                <td style={style}>{fullName(name)}</td>
                <td className="text-center" style={style}>
                  {mobile(phone)}
                </td>
                <td className="text-center" style={style}>
                  {hea}
                </td>
                <td className="text-center" style={style}>
                  {id}
                </td>
                <td className="text-center" style={style}>
                  {dateFormat(from)}
                </td>
                <td className="text-center" style={style}>
                  {dateFormat(to)}
                </td>
                <td className="text-center" style={style}>
                  <MDBBtnGroup>
                    <MDBBtn
                      size="sm"
                      rounded
                      color="info"
                      onClick={() => handleApprove(applicant)}
                    >
                      <MDBIcon icon="user-check" />
                    </MDBBtn>
                    <MDBBtn
                      size="sm"
                      rounded
                      color="danger"
                      onClick={() => handleReject(applicant)}
                    >
                      <MDBIcon icon="user-times" />
                    </MDBBtn>
                  </MDBBtnGroup>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="7" className="text-center">
              {didSearch ? "No results try another keyword." : "No Applicants"}
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Table;
