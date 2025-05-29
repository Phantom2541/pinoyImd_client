import { ENDPOINT, FailedBanner } from "../index";
import { useSelector } from "react-redux";

export default function Banner() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {}, name = "" } = branch || {};

  return (
    <div className="print-header">
      <img
        src={`${ENDPOINT}/public/companies/${companyId?.name}/${name}/banner.png`}
        onError={(e) => (e.target.src = FailedBanner)}
        width="100%"
        height="85px"
        alt={`${name} Banner`}
      />
    </div>
  );
}
