import { isEmpty } from "lodash";
import { MDBBadge } from "mdbreact";
import { capitalize } from "../../../../../../../../services/utilities";
const statusMap = {
  0: "Pending",
  1: "Ongoing",
  2: "Done",
  3: "Cancelled",
};
const statusColor = {
  0: "primary",
  1: "warning",
  2: "success",
  3: "danger",
};
const LIS_STATUS = ({ workarea = {} }) => {
  const machines = Object.keys(workarea);

  if (isEmpty(machines)) return "";
  return (
    <>
      {Object.entries(workarea).map(([key, value], index) => {
        const { s } = value;
        return (
          <MDBBadge className="ml-1" color={statusColor[s]} key={index}>
            {capitalize(key)}: {statusMap[s]}
          </MDBBadge>
        );
      })}
    </>
  );
};

export default LIS_STATUS;
