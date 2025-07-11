import { MDBCol, MDBCardBody, MDBCard, MDBBadge } from "mdbreact";
import { Privileges, Services } from "../../../../../../../../services/fakeDb";
import { mobile } from "../../../../../../../../services/utilities";
const Contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};
const Customer = ({ deal }) => {
  const {
    pid: customerId,
    branchId,
    ssx,
    privilege,
    sendouts,
    services,
  } = deal;
  const { mobile: _mobile = "" } = customerId || {};
  const { contract } = sendouts || {};

  return (
    <MDBCol md="4">
      <MDBCard>
        <MDBCardBody>
          {[
            { title: "SSX", value: ssx || "None" },
            { title: "Category", value: "OPD" },
            {
              title: "Privilege",
              value: Privileges[privilege],
            },
            { title: "Mobile", value: mobile(_mobile) },
            {
              title: "Source",
              value: branchId?.displayname,
            },
            {
              title: "Contract",
              value: Contracts[contract],
            },
            {
              title: "Request Services",
              value: (
                <>
                  {services?.map((id, key) => (
                    <MDBBadge key={key} className="mr-1">
                      {Services.getAbbr(id)}
                    </MDBBadge>
                  ))}
                </>
              ),
            },
          ].map(({ title, value }, index) => (
            <div key={index}>
              <span className="mr-2 grey-text" style={{ fontSize: "0.8rem" }}>
                {title}:
              </span>
              <h6>{value}</h6>
            </div>
          ))}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Customer;
