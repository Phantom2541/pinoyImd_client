import { useSelector } from "react-redux";
import {
  fullAddress,
  fullName as formattedName,
  getAge,
  getGenderIcon,
} from "../../../../../services/utilities";
import Loading from "../loading";

const Header = () => {
  const { result, isLoading, rendered } = useSelector(({ portal }) => portal);
  const { customerId = {}, branchId, createdAt } = result;
  const { address, dob, fullName, isMale } = customerId;
  const { name, companyId } = branchId || {};

  const renderLoading = (items) =>
    items.map(({ width, for: loadingFor }, i) => (
      <div key={i} style={{ width }} className="mb-2">
        <Loading loadingFor={loadingFor} />
      </div>
    ));

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div>
      {isLoading ? (
        renderLoading([
          { width: "20rem", for: "name" },
          { width: "8rem", for: "gender" },
          { width: "22.5rem", for: "address" },
        ])
      ) : (
        <>
          <h5 className="ellipsis" style={{ fontWeight: 600 }}>
            {formattedName(fullName, true)}
          </h5>
          <h6 style={{ marginTop: "-0.5rem" }}>
            {getGenderIcon(isMale)} {getAge(dob)}
          </h6>
          <h6 style={{ marginTop: "-0.4rem" }}>{fullAddress(address)}</h6>
        </>
      )}

      <hr style={{ marginTop: "0.5rem" }} />

      {/* Diagnostic and Branch */}
      <div className="d-flex align-items-center justify-content-between">
        {[
          { label: "Diagnostic", value: companyId?.name },
          { label: "Branch", value: name },
        ].map(({ label, value }, i) => (
          <div
            key={i}
            className="d-flex align-items-center"
            style={{ marginTop: i === 0 ? "-0.3rem" : "-0.4rem" }}
          >
            <h5 style={{ fontSize: "0.9rem" }}>{label}:</h5>
            {isLoading ? (
              <div
                style={{ width: "5rem", marginTop: "-0.6rem" }}
                className="ml-1"
              >
                <Loading loadingFor="company" />
              </div>
            ) : (
              <span style={{ marginTop: "-0.6rem" }} className="ml-1">
                <strong>{value}</strong>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-n1">
        {[
          { label: "Transaction", value: createdAt },
          ...(rendered?._id ? [{ label: "Rendered", value: rendered.at }] : []),
        ].map(({ label, value }, idx) => (
          <div key={idx} className="d-flex align-items-center">
            <h5 style={{ fontSize: "0.9rem" }}>{label}:</h5>
            {isLoading ? (
              <div
                style={{ width: "5rem", marginTop: "-0.6rem" }}
                className="ml-1"
              >
                <Loading loadingFor="company" />
              </div>
            ) : (
              <span style={{ marginTop: "-0.6rem" }} className="ml-1">
                <strong>{formatTime(value)}</strong>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
