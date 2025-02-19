import { MDBIcon } from "mdbreact";
import React from "react";

export default function Search({ info = {} }) {
  const {
    message = "Last name, First name y Middle name",
    description = "Please maintain this order when searching.",
  } = info;

  return (
    <div className="d-flex align-items-center">
      <div className="cashier-instruction">
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
      <form
        className="cashier-search"
        // className={`cashier-search ${didSearch && "active"} ${
        //   selected && "pickedSearch"
        // }`}
      >
        <input placeholder="Search..." autoCorrect="off" spellCheck={false} />
        <button
          type="button"
          //   onClick={() => {
          //     setDidSearch(!didSearch);
          //     setSelected("");
          //   }}
          //   className={`${didSearch || selected ? "bg-danger" : ""}`}
        >
          <MDBIcon icon="search" className="search-icon" />
        </button>
      </form>
    </div>
  );
}
