import "./style.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BROWSE } from "../../../../../../services/redux/slices/assets/companies";

export default function MissionVision() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ companies }) => companies),
    dispatch = useDispatch();

  // Initial fetch
  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;
  console.log("company", activePlatform);

  return (
    <div className="template-cards-container">
      <div className="d-flex flex-column">
        {/* Company Card including Mission and Vision inside */}
        <div className="template4-card">
          <div className="template4-card-header">
            <h3 className="template4-card-title">{companyId?.name}</h3>
            <small>{companyId.subName}</small>
          </div>
          <div className="template4-card-body">
            {/* Mission Section */}
            <div className="section-box">
              <h5 className="template4-subtitle">
                <b>Mission</b>{" "}
              </h5>
              <p className="template4-card-text">
                {companyId?.ms ? (
                  companyId?.ms
                ) : (
                  <i className="text-muted">No mission statement provided.</i>
                )}
              </p>
            </div>

            {/* Vision Section */}
            <div className="section-box">
              <h5 className="template4-subtitle">
                <b>Vision</b>
              </h5>
              <p className="template4-card-text">
                {companyId?.vs ? (
                  companyId?.vs
                ) : (
                  <i className="text-muted">No vision statement provided.</i>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
