import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { dateFormat } from "../../../../../../services/utilities";
import { SetEDIT } from "../../../../../../services/redux/slices/diagnostics/clinician/quest";


const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const {  company, location, schedule, status  } = item,
  dispatch = useDispatch();

  /**
   * Sets the quest to edit mode by dispatching the SetEDIT action to the store
   * @function
   * @param {Object} item the quest to edit
   */
  const handleAdd = () =>
    dispatch(SetEDIT(item));
  
  return (
    <div className={`d-flex justify-content-between ${textColor} `}>
      {index + 1}. {company} {location} {dateFormat( schedule)}
      <div className="d-flex">
        <small className="mr-2 mt-1">
      {status}
        </small>
        <MDBBtn
          color="primary" size="sm" rounded onclick={handleAdd}>
          <MDBIcon icon="pencil-alt"/>

        </MDBBtn>

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
