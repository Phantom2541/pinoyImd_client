import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBContainer,
  MDBInput,
  MDBTextArea,
  MDBTypography,
} from "mdbreact";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../../../components/utilities";
import { PresetUser, ENDPOINT } from "../../../../../../services/utilities";

export default function PetitionRecord({ roles }) {
  const { theme, auth } = useSelector(({ auth }) => auth),
    { record } = useSelector(({ petitions }) => petitions),
    [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (record.role) {
      setSelectedRole(roles.find((role) => role.role === record.role));
    }
  }, [record, roles]);

  return (
    <MDBContainer fluid>
      <MDBTypography
        tag="h4"
        className="mb-3 d-flex align-items-center justify-content-between"
      >
        <span>Current Application form</span>
        <MDBBadge
          color={record.status === "pending" ? "info" : "success"}
          className="text-uppercase"
        >
          {record.status}
        </MDBBadge>
      </MDBTypography>
      <MDBInput
        label="Company and Branch"
        value={`${record.companyId?.name}, ${record.branchId?.name}`}
        contrast={theme.dark}
        readOnly
        className="mb-3 bg-transparent"
      />
      <MDBInput
        label="Position"
        value={selectedRole.name}
        contrast={theme.dark}
        readOnly
        className="mb-3 bg-transparent"
      />
      <MDBTextArea
        label="Message"
        value={record.message}
        readOnly
        className="bg-transparent"
        contrast={theme.dark}
      />
      <div className="ratio ratio-16x9 mt-3">
        <iframe
          src={`${ENDPOINT}/assets/bio/${auth.email}.pdf`}
          title="Your CV."
        />
      </div>
    </MDBContainer>
  );
}
