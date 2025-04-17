import React from "react";
import { MDBContainer } from "mdbreact";
import { useSelector } from "react-redux";
import { billingAddress, fullName } from "../../services/utilities";
import { Policy } from "../../services/fakeDb";

export default function EmploymentContractPage() {
  const { auth, activePlatform } = useSelector(({ auth }) => auth);
  const { department, branch, position } = activePlatform;
  const { contract, companyId, name } = branch;

  const employeeName = fullName(auth.fullName);
  const employeeAddress = billingAddress(auth.curraddress);
  const companyName = companyId.name;
  const companySubName = companyId.subName;
  const branchName = name;
  const departmentName = Policy.getDepname(department);
  const positionTitle = Policy.getPosition(position);
  const employmentStatus = contract.soe;

  return (
    <MDBContainer
      className="my-5 p-5"
      style={{
        background:
          "url('https://www.transparenttextures.com/patterns/paper-fibers.png') #fdf6e3",
        border: "10px solid #a67c52",
        borderRadius: "40px",
        fontFamily: "'Cormorant Garamond', serif",
        maxWidth: "900px",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="text-center mb-5">
        <h2 style={{ fontWeight: "bold", color: "#5a3921" }}>
          📝 Employment Contract
        </h2>
      </div>

      <p>
        <strong>This Employment Agreement</strong> is made and entered into by
        and between:
      </p>
      <p>
        <h4>
          {companyName}
          <br />
          <small>{companySubName}</small>
        </h4>
        {branchName} Branch
        <br />
        (hereinafter referred to as the <em>"Employer"</em>)
      </p>
      <p>and</p>
      <p>
        <strong>{employeeName}</strong>
        <br />
        {employeeAddress}
        <br />
        (hereinafter referred to as the <em>"Employee"</em>)
      </p>

      <hr />

      <h5 className="mt-4" style={{ color: "#6b4226" }}>
        Position and Department
      </h5>
      <p>
        The Employer hereby employs the Employee in the position of{" "}
        <strong>
          <b style={{ color: "blue" }}>{positionTitle}</b>
        </strong>{" "}
        under the{" "}
        <strong>
          <b style={{ color: "blue" }}>{departmentName}</b>
        </strong>{" "}
        Department.
      </p>

      <h5 className="mt-4" style={{ color: "#6b4226" }}>
        Status of Employment
      </h5>
      <p>
        The nature of the employment shall be:{" "}
        <strong>
          <b style={{ color: "blue" }}>{employmentStatus}</b>
        </strong>
      </p>

      <h5 className="mt-4" style={{ color: "#6b4226" }}>
        Terms and Conditions
      </h5>
      <ol>
        <li>
          <strong>Commencement of Employment:</strong> The Employee’s
          appointment shall commence on the agreed start date as reflected in
          the HR records.
        </li>
        <li>
          <strong>Duties and Responsibilities:</strong> The Employee agrees to
          diligently perform the duties and responsibilities attached to the
          said position.
        </li>
        <li>
          <strong>Compensation:</strong> Salary and benefits shall be in
          accordance with company policy and subject to periodic review.
        </li>
        <li>
          <strong>Company Policies:</strong> The Employee agrees to abide by
          company rules and regulations.
        </li>
        <li>
          <strong>Termination:</strong> This contract may be terminated by
          either party in accordance with labor laws and company policy.
        </li>
      </ol>

      <div
        className="text-center mt-5"
        style={{ fontStyle: "italic", color: "#8b5e3c" }}
      >
        "Let it be known that the bearer of this contract is duly appointed."
      </div>

      <div className="row mt-5">
        <div className="col-6 text-center">
          ___________________________
          <br />
          <strong>{employeeName}</strong>
          <br />
          Employee
        </div>
        <div className="col-6 text-center">
          ___________________________
          <br />
          <strong>Authorized Representative</strong>
          <br />
          For and on behalf of the Employer
        </div>
      </div>

      <div className="text-center mt-4">
        <em>Signed this ____ day of ______________, 20____.</em>
      </div>
    </MDBContainer>
  );
}
