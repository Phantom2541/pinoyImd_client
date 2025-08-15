import Table from "./table";
import "./style.css";
import { Banner } from "../../../../services/utilities";
export default function Hr({ payroll, onloaded, setOnloaded }) {
  const { branch = {} } = payroll;
  const { companyId = {} } = branch;
  return (
    <div className="payslip-hr-printout">
      <Banner
        company={companyId?.name}
        branch={branch?.name}
        bid={branch?.bid || ""}
        onloaded={onloaded}
        setOnloaded={setOnloaded}
        className="payslip-banner-printout"
      />
      <Table />
    </div>
  );
}
