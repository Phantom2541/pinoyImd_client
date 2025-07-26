import { useSelector } from "react-redux";
import { HMO } from "../../../../../services/fakeDb";
import { mobile } from "../../../../../services/utilities";
const Body = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;
  const { hmo = [] } = companyId;
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-wrap"
      style={{ gap: "15px" }}
    >
      {hmo.map((data, index) => {
        const { code, cp } = data;
        const { phone, email, agent } = cp;
        return (
          <div key={index} className="template7-card">
            <div className="template7-card-header">
              <img
                src={HMO.getIcon(code)}
                alt="Card Visual"
                className="template7-card-image"
              />
            </div>
            <div className="template7-card-body">
              <span className="template7-card-title">{HMO.getName(code)}</span>
              <div className="template7-card-info">
                <span className="template7-card-name">{agent}</span>
                <span className="template7-card-number">{mobile(phone)}</span>
                <span className="template7-card-email">{email}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Body;
