import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { Templates } from "../../../../../../services/fakeDb";

const Header = ({ branch, isOpen, textColor, index, setActiveId }) => {
  const { name, abbreviation, template } = branch;
  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      <div>
        {index + 1}. {name} {abbreviation}
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
        <small className="mr-2 mt-1">
          {Templates.getComponentName(template)}
        </small>
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
