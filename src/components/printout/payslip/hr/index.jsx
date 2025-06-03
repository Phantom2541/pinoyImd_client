import Table from "./table";
import "./style.css";
import { Banner } from "../../../../services/utilities";
import { useSelector } from "react-redux";
export default function Hr() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {}, name = "" } = branch;
  return (
    <div className="payslip-hr-printout">
      <Banner
        company={companyId?.name}
        branch={name}
        className="payslip-banner-printout"
      />
      <Table />
    </div>
  );
}
