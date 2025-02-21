import { MDBBtn, MDBModal, MDBModalHeader } from "mdbreact";
import React, { useState } from "react";
import { computeGD, currency } from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";

const Card = ({
  menu,
  chosen = "selected",
  handlePick,
  categoryIndex,
  privilegeIndex,
}) => {
  const { description = "", abbreviation = "", packages = [] } = menu,
    { gross } = computeGD(menu, categoryIndex, privilegeIndex);

  return (
    <div className="conflict-card" onClick={() => handlePick(chosen)}>
      <div className="conflict-card-header">
        <div>
          <span>{abbreviation}</span>
          {description && (
            <>
              <br />
              <small>{description}</small>
            </>
          )}
        </div>
        <p>{currency(gross)}</p>
      </div>
      <div className="conflict-card-body">
        <div className="package-wrapper">
          {packages?.map((pack) => (
            <small key={`conflict-package-${pack}`}>
              {Services.getName(pack)}
            </small>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ConflictModal({
  data,
  handleConflict,
  categoryIndex,
  privilegeIndex,
}) {
  const [choice, setChoice] = useState("selected");

  const { show, selected, conflicts = [] } = data;

  return (
    <MDBModal
      className="modal-dialog-centered"
      isOpen={show}
      toggle={() => {}}
      backdrop
      size="xl"
    >
      <MDBModalHeader className="light-blue darken-3 white-text">
        Resolve Conflicts
      </MDBModalHeader>
      <div className="conflict-modal-header">
        <p>There has been a conflict with your recent selected menu.</p>
        <span>Please choose a menu that you would like to retain.</span>
      </div>
      <div className="conflict-modal-body">
        <div
          className={`conflict-card-container ${
            choice === "selected" && "active"
          }`}
        >
          <label>Selected Menu</label>
          <Card
            menu={selected}
            handlePick={setChoice}
            categoryIndex={categoryIndex}
            privilegeIndex={privilegeIndex}
          />
        </div>
        <p className="conflict-or">OR</p>
        <div
          className={`conflict-card-container ${
            choice === "conflict" && "active"
          }`}
        >
          <label>Conflict Menu</label>
          <div className="conflict-card-wrapper">
            {conflicts.map((conflict, index) => (
              <Card
                key={`conflict-${index}`}
                menu={conflict}
                chosen="conflict"
                handlePick={setChoice}
                categoryIndex={categoryIndex}
                privilegeIndex={privilegeIndex}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="conflict-modal-footer">
        <p>
          You have chosen <span>{choice} Menu</span>, this will result to
          removing&nbsp;
          <span>{choice === "selected" ? "Conflict" : "selected"} Menu</span>
        </p>
        <MDBBtn
          onClick={() => {
            setChoice("selected");
            handleConflict(choice === "selected");
          }}
          color="primary"
          className="float-right"
        >
          PROCEED
        </MDBBtn>
      </div>
    </MDBModal>
  );
}
