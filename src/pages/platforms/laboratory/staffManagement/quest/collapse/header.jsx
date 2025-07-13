import React from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { SetTeam } from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
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
      <div
        className={`d-flex justify-content-between align-items-center ${textColor}`}
      >
        <span>
          {`${index + 1}. ${item?.company} ${item?.location} ${dateFormat(
            item?.schedule
          )}`}
        </span>
        <div className="d-flex align-items-center">
          <small className="mr-2">{item?.status}</small>

          <MDBDropdown>
            <MDBDropdownToggle
              size="sm"
              color="primary"
              className="rounded-pill d-flex align-items-center justify-content-center p-0"
              style={{ width: "30px", aspectRatio: "1/1" }}
            >
              <MDBIcon fas icon="bars" />
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem>
                <MDBIcon
                  icon="plus"
                  className="mr-2"
                  onClick={() => {
                    dispatch(SetTeam({ _id: item?._id, team: item?.team }));
                  }}
                />
                Tag Member
              </MDBDropdownItem>
              <MDBDropdownItem onClick={handleEdit}>
                <MDBIcon icon="pencil-alt" className="mr-2" />
                Edit
              </MDBDropdownItem>
              {/* ✅ Delete Button with Red Hover Effect */}
              <MDBDropdownItem
                onClick={handleDelete}
                style={{
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef5350")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "")
                }
              >
                <MDBIcon icon="trash-alt" className="mr-2" />
                Delete
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>

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
