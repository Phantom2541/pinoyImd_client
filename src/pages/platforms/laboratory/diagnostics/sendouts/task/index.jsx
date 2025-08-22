import { MDBCollapse } from "mdbreact";
import Body from "../../tasks/collapse/body";

const Task = ({ dealId, isOpen = false }) => {
  const {
    _id,
    customerId,
    soDiagnostic: diagnostic,
    category,
    source,
    physicianId,
    physicianSTR,
  } = dealId;
  const referral = physicianId?.fullName?.lname || physicianSTR || "";
  return (
    <MDBCollapse id={`collapse-${_id}`} isOpen={isOpen} className="m-0 p-0">
      <Body
        _id={_id}
        customer={customerId}
        tasks={diagnostic}
        category={category}
        source={source}
        referral={referral}
        deal={dealId}
      />
    </MDBCollapse>
  );
};

export default Task;
