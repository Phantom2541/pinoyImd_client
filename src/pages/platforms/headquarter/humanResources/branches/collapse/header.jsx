import { MDBBadge, MDBBtn, MDBIcon } from "mdbreact";
import { capitalize } from "lodash";
import { useDispatch } from "react-redux";
import { SetSELECTED } from "../../../../../../services/redux/slices/assets/branches";

const Header = ({ branch, isOpen, textColor, index, setActiveId }) => {
  const { settings = {}, displayname = "", code = "", isMain = false } = branch;
  const { subscription = "demo", status = "draft" } = settings;
  const dispatch = useDispatch();

  // Subscription colors
  const getColorBySubscriptionType = (type) => {
    const map = {
      demo: "secondary",
      subscriber: "primary",
      loyalty: "success",
      lifetime: "dark",
    };
    return map[type?.toLowerCase()] || "secondary";
  };

  // Status colors
  const getColorByStatusType = (type) => {
    const map = {
      draft: "light",
      active: "primary",
      expired: "danger",
      suspended: "warning",
      cancelled: "secondary",
    };
    return map[type?.toLowerCase()] || "secondary";
  };

  const handleTitle = (type) => {
    switch (type?.toLowerCase()) {
      case "draft":
        return "This branch is inactive. To activate a demo, please contact support.";
      case "demo":
        return "You are currently on a 3-month demo subscription.";
      case "subscriber":
        return "You are a regular subscriber.";
      case "loyalty":
        return "You are on a loyalty subscription.";
      case "lifetime":
        return "You have a lifetime subscription.";
      case "active":
        return "This branch is active.";
      case "expired":
        return "The branch's subscription has expired.";
      case "suspended":
        return "This branch's subscription is temporarily suspended.";
      case "cancelled":
        return "This branch's subscription has been cancelled.";
      default:
        return "";
    }
  };

  return (
    <div className={`d-flex justify-content-between ${textColor}`}>
      <div>
        {index + 1}. {displayname.toUpperCase()} - {code}
        {!branch?.ao && (
          <MDBIcon
            fas
            icon="exclamation-triangle ml-2"
            title="This branch currently has no assigned Administrative Officer"
            style={{ color: isOpen ? "white" : "orange" }}
          />
        )}
        <MDBIcon
          title="Update Branch"
          className="ml-3"
          icon="pencil-alt"
          onClick={() => dispatch(SetSELECTED(branch))}
        />
      </div>

      <div className="d-flex">
        {isMain && (
          <MDBBadge color="warning" pill className="mr-3" title="Main Branch">
            Main
          </MDBBadge>
        )}

        {/* Status Badge */}
        <MDBBadge
          color={getColorByStatusType(status)}
          className="mr-3"
          pill
          title={handleTitle(status)}
        >
          <small>{capitalize(status)}</small>
        </MDBBadge>

        {/* Subscription Badge */}
        <MDBBadge
          color={getColorBySubscriptionType(subscription)}
          className="mr-3"
          pill
          title={handleTitle(subscription)}
        >
          <small>{capitalize(subscription)}</small>
        </MDBBadge>

        <MDBBtn
          size="sm"
          color="white"
          rounded
          onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
          className="m-0 p-0 transition-all"
          style={{ width: isOpen ? "1.5rem" : "2rem" }}
        >
          <i
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all"
          />
        </MDBBtn>
      </div>
    </div>
  );
};

export default Header;
