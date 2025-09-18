import React from "react";
import { MDBIcon } from "mdbreact";

const Notification = ({ didSearch }) => {
  const message = "Menu name or Abbreviation",
    description = "Please maintain this order when searching.";

  return (
    <div className={`cashier-instruction ${didSearch && "hide"}`}>
      <MDBIcon
        icon="info-circle"
        size="lg"
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
