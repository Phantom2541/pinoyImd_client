import { useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { HMO } from "../../../../../../services/fakeDb";
import { mobile } from "../../../../../../services/utilities";
const Body = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;
  const { hmo = [] } = companyId;
  console.log("hmo", hmo);
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Contact Person</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {hmo.map((data, index) => {
          const { code, cp } = data;
          const { phone, email, agent } = cp;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{HMO.getName(code)}</td>
              <td>{mobile(phone)}</td>
              <td>{email}</td>
              <td>{agent}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;
