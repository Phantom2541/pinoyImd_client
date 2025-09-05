import { MDBIcon } from "mdbreact";

const Notification = ({ didSearch, size = "lg" }) => {
  const message = "Last name, First name y Middle name",
    description = "Please maintain this order when searching.";

  return (
    <div className={`cashier-instruction ${didSearch && "hide"}`}>
      <MDBIcon
        icon="info-circle"
        size={size}
        className="text-info cursor-pointer"
      />
      <div style={{ fontSize: "0.8rem" }}>
        <p>{message}</p>
        <i>{description}</i>
      </div>
    </div>
  );
};

export default Notification;
