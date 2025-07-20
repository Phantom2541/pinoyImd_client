import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { collections } = useSelector(({ personnels }) => personnels);

  return (
    <div id="print-section">
      {
        <MDBTable responsive hover>
          <thead style={{ backgroundColor: "#", color: "black" }}>
            <tr>
              <th>#</th>
              <th>Members</th>
              <th>Email</th>
              <th>Type of ShareHolder</th>
              <th>shares owned</th>
              <th>% Ownership</th>
              <th>Date Acquired</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((branch, index) => {
              console.log("collections", collections);

              const { user } = branch;
              const { fullName, email, ownership, activePlatform } = user,
                { role } = activePlatform,
                { length } = ownership;
              const { fname, lname, mname } = fullName;

              return (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td>{`${fname} ${mname} ${lname}`}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{length}</td>
                  <td>{length}</td>
                </tr>
              );
            })}
          </tbody>
        </MDBTable>
      }
    </div>
  );
};

export default Body;
