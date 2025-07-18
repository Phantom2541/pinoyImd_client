import { MDBIcon } from "mdbreact";

const Notification = ({ didSearch, iconSize = "lg" }) => {
  const message = "Last name, First name y Middle name",
    description = "Please maintain this order when searching.";

  return (
    <div
      className={`cashier-instruction ${didSearch && "hide"}`}
      style={{
        zIndex: "9999 !important",
        position: "relative",
      }}
    >
      <MDBIcon
        icon="info-circle"
        size={iconSize}
        className="text-info cursor-pointer"
      />
      <div>
        <p>{message}</p>
        <i>{description}</i>
      </div>
    </div>
  );
};

export default Notification;
