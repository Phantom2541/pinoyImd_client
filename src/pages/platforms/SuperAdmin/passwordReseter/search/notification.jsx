import { MDBIcon } from "mdbreact";

const Notification = () => {
  return (
    <div
      className={`cashier-instruction `}
      style={{
        zIndex: "9999 !important",
        position: "relative",
      }}
    >
      <MDBIcon
        icon="info-circle"
        size={"lg"}
        className="text-info cursor-pointer"
      />
      <div>
        <p>Last name, First name y Middle name</p>
        <p>Or Email Address</p>
        <i>Please maintain this order when searching.</i>
      </div>
    </div>
  );
};

export default Notification;
