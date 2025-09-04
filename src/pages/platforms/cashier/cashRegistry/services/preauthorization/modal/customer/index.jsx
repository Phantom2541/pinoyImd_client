import { MDBCol, MDBCardBody, MDBCard, MDBBadge } from "mdbreact";
import {
  Categories,
  HMO,
  Privileges,
  Services,
} from "../../../../../../../../services/fakeDb";
import { mobile } from "../../../../../../../../services/utilities";
const Contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};
const Customer = ({ deal, categoryIndex }) => {
  const {
    pid: customerId,
    // branchId,
    client,
    ssx,
    privilege,
    services,
    isValidation = false,
    contract,
  } = deal;
  const { mobile: _mobile = "", healthCard = {} } = customerId || {};

  return (
    <MDBCol md="4">
      <MDBCard>
        <MDBCardBody>
          {[
            { title: "SSX", value: ssx || "None" },
            { title: "Category", value: Categories[categoryIndex]?.name },
            {
              title: "Privilege",
              value: Privileges[privilege],
            },
            { title: "Mobile", value: mobile(_mobile) },
            {
              title: "Source",
              value: client?.displayname || client?.name,
            },
            {
              title: isValidation ? "HMO" : "Contract",
              value: isValidation
                ? HMO.getName(healthCard.name)
                : Contracts[contract],
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
