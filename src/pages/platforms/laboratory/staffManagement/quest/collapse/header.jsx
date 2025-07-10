import React from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useDispatch } from "react-redux";
import { dateFormat } from "../../../../../../services/utilities";
import { SetEDIT } from "../../../../../../services/redux/slices/diagnostics/clinician/quest";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(SetEDIT(item));
  };

  const handleDelete = () => {
    console.log("Delete clicked", item);
  };

  const toggleActive = () => {
    setActiveId((prev) => (index === prev ? -1 : index));
  };

  return (
    <>
      <div className={`d-flex justify-content-between ${textColor}`}>
        {`${index + 1}. ${item?.company} ${item?.location} ${dateFormat(
          item?.schedule
        )}`}
        <div className="d-flex align-items-center">
          <small className="mr-2">{item?.status}</small>

          {/* Oval Rounded Pencil Icon Button */}
          <MDBDropdown>
            <MDBDropdownToggle
              size="sm"
              color="primary"
              className="rounded-pill d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "35px" }}
            >
              <MDBIcon icon="pencil-alt" />
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem onClick={handleEdit}>
                <MDBIcon icon="pencil-alt" className="mr-2" />
                Edit
              </MDBDropdownItem>
              <MDBDropdownItem onClick={handleDelete}>
                <MDBIcon icon="trash-alt" className="mr-2" />
                Delete
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>

          {/* Collapse Toggle Button */}
          <MDBBtn
            size="sm"
            color="white"
            rounded
            onClick={toggleActive}
            className="m-0 p-0 transition-all"
            style={{ width: isOpen ? "1.5rem" : "2rem" }}
            aria-label="Toggle details"
          >
            <i
              style={{ transform: `rotate(${isOpen ? 0 : 90}deg)` }}
              className="fa fa-angle-down transition-all"
            />
          </MDBBtn>
        </div>
      </div>
    </>
  );
};

export default Header;
