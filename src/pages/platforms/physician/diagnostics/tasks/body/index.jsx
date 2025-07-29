import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { useSelector } from "react-redux";
import {
  fullName,
  handlePagination,
} from "../../../../../../services/utilities";
import Diagnostics from "./diagnostics";

const Body = () => {
  const { maxPage } = useSelector(({ auth }) => auth);

  const { filteredStatus, activePage } = useSelector(
    ({ validator }) => validator
  );

  return (
    <div className="mx-2">
      <MDBTable small>
        <MDBTableHead>
          <tr>
            <th>#</th>
            <th>Branch</th>
            <th>Patient</th>
            <th>Template/Services</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {handlePagination(filteredStatus, activePage, maxPage).map(
            (deal, index) => {
              const { branchId = {}, customerId = {} } = deal;
              const { name, displayname, companyId = {} } = branchId;
              const { name: cName } = companyId;
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>
                      {name || displayname}
                    </span>{" "}
                    <br />
                    <span>{cName}</span>
                  </td>
                  <td>{fullName(customerId.fullName)}</td>
                  <Diagnostics deal={deal} />
                </tr>
              );
            }
          )}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
};

export default Body;
