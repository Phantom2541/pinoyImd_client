import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTable,
  MDBBadge,
  MDBCard,
} from "mdbreact";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../../services/redux/slices/assets/providers";
import "./style.css";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (hotlines) => {
    dispatch(SetSELECTED(hotlines));
    //console.log("SetSelected service :", service);
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <div className="hotline-list">
      {paginatedData?.map((hotlines, index) => {
        const { _id, abbr, displayname, number, address } = hotlines;

        return (
          <MDBCard key={`${index}-${_id}`} className="hotline-card">
            {/* Header */}
            <div className="hotline-header">
              <h2 className="hotline-title">{displayname}</h2>

              {abbr ? (
                <MDBBadge title="Click me to update" className="hotline-badge">
                  {abbr}
                </MDBBadge>
              ) : (
                <MDBBadge color="secondary" className="hotline-badge">
                  N/A
                </MDBBadge>
              )}
            </div>

            {/* Number */}
            <h6 className="hotline-info">
              <MDBIcon fas icon="phone-alt" className="hotline-icon" />
              {number || "No number"}
            </h6>

            {/* Address */}
            <h6 className="hotline-info">
              <MDBIcon fas icon="map-marker-alt" className="hotline-icon" />
              {address || "No address"}
            </h6>
            <button className="hotline-delete bg-danger" onClick={handleDelete}>
              <MDBIcon fas icon="trash-alt" />
            </button>
          </MDBCard>
        );
      })}
    </div>
  );
};

export default Body;
