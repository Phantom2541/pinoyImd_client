import { MDBBadge, MDBBtn, MDBIcon } from "mdbreact";
import { capitalize } from "lodash";

const Header = ({ branch, isOpen, textColor, index, setActiveId }) => {
  const { settings = {}, name = "", code = "" } = branch;
  const { subscription = "demo" } = settings;

  const getColorBySubscriptionType = (type) => {
    console.log("type", type);
    switch (type) {
      case "demo":
        return "warning";
      case "monthly":
        return "info";
      case "quarterly":
        return "primary";
      case "yearly":
        return "success";
      case "lifetime":
        return "dark";
      default:
        return "secondary";
    }
  };

  const handleTitle = (type) => {
    if (type === "demo") return "6 months trial";
    return `Enjoy your ${type} subscription.`;
  };

  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div>
        {index + 1}. {capitalize(name)} - {code}
        {!branch?.ao && (
          <MDBIcon
            fas
            icon="exclamation-triangle ml-2"
            title="This branch currently has no assigned Administrative Officer"
            style={{ color: isOpen ? "white" : "orange" }}
          />
        )}
      </div>
      <div className="d-flex">
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
          className="m-0 p-0 transition-all "
          style={{ width: isOpen ? "1.5rem" : "2rem" }}
        >
          <i
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all "
          />
        </MDBBtn>
      </div>
    </div>
  );
};

export default Header;
