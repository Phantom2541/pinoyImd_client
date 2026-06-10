import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { collections } = useSelector(({ personnels }) => personnels);
  const members = Array.isArray(collections) ? collections : [];

  const formatName = (fullName = {}) =>
    [fullName?.fname, fullName?.mname, fullName?.lname]
      .filter(Boolean)
      .join(" ");

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString();
  };

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
            {members.map((member, index) => {
              const user = member?.user || {};
              const role = user?.activePlatform?.role || member?.type || "";
              const ownershipCount = Array.isArray(user?.ownership)
                ? user.ownership.length
                : Number(user?.ownership) || 0;
              const sharesOwned =
                member?.sharesOwned ?? member?.shares ?? ownershipCount;
              const ownershipPercentage =
                member?.ownershipPercentage ?? member?.percentage ?? "";
              const acquiredAt =
                member?.dateAcquired ?? member?.acquiredAt ?? "";
              const status = member?.status || user?.status || "";

              return (
                <tr key={member?._id || user?._id || index}>
                  <td> {index + 1}</td>
                  <td>{formatName(user?.fullName)}</td>
                  <td>{user?.email || ""}</td>
                  <td>{role}</td>
                  <td>{sharesOwned || ""}</td>
                  <td>{ownershipPercentage || ""}</td>
                  <td>{formatDate(acquiredAt)}</td>
                  <td>{status}</td>
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
