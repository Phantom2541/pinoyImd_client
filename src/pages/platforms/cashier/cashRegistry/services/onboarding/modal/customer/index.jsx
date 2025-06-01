import { MDBCol, MDBCardBody, MDBCard, MDBBadge } from "mdbreact";
import {
  Memberships,
  Privileges,
  Services,
} from "../../../../../../../../services/fakeDb";
import { mobile } from "../../../../../../../../services/utilities";

const Customer = ({ deal }) => {
  const { customerId, branchId, ssx, privilege, sendouts } = deal;
  const { mobile: _mobile } = customerId;
  const membership =
    Memberships.find(({ value }) => value === sendouts.membership)?.text ||
    false;

  console.log("membership", membership);
  return (
    <MDBCol md="4">
      <MDBCard>
        <MDBCardBody>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              SSX:
            </span>
            <h6>{ssx || "None"}</h6>
          </div>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              Category:
            </span>
            <h6>OPD</h6>
          </div>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              Privillege:
            </span>
            <h6>{Privileges[privilege]}</h6>
          </div>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              Mobile:
            </span>
            <h6>{mobile(_mobile)}</h6>
          </div>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              Source:
            </span>
            <h6>
              {branchId?.displayname} {membership && `(${membership})`}
            </h6>
          </div>
          <div>
            <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
              Request Services:
            </span>
            <br />
            {sendouts?.servicesId?.map((id, key) => (
              <MDBBadge key={key} className="mr-1">
                {Services.getAbbr(id)}
              </MDBBadge>
            ))}
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Customer;
