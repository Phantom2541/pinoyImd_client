import { useSelector } from "react-redux";
import { MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { HMO } from "../../../../../services/fakeDb";
import { mobile } from "../../../../../services/utilities";
import { UPDATE } from "../../../../../services/redux/slices/assets/companies";
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";
import Swal from "sweetalert2";
const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ companies }) => companies
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleRemoved = (code) => {
    const newHMO = filtered.filter((item) => item.code !== code && item.code);
    Swal.fire({
      title: `are you sure to remove this ${HMO.getName(code)}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed)
        dispatch(
          UPDATE({
            data: { _id: activePlatform.branch.companyId._id, hmo: newHMO },
            token,
          })
        ).then(() => {
          dispatch(SetActivePlatform({ data: newHMO, isHMO: true }));
        });
    });
  };
  console.log("fil", filtered);

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage + 1;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-wrap"
      style={{ gap: "15px" }}
    >
      {paginatedData.map((data, index) => {
        const { code = "", cp = {} } = data;
        const { phone = "", email = "", agent = "" } = cp;
        return (
          <div className="template7-card">
            <div className="template7-card-header">
              <img
                src={HMO.getIcon(code)}
                alt="Card Visual"
                className="template7-card-image"
              />
            </div>
            <div className="template7-card-body">
              <span className="template7-card-title">{HMO.getName(code)}</span>
              <div className="template7-card-info">
                <span className="template7-card-name">{agent}</span>
                <span className="template7-card-number">{mobile(phone)}</span>
                <span className="template7-card-email">{email}</span>
              </div>
            </div>
            <div className="template7-card-footer">
              <button className="bg-danger" onClick={() => handleRemoved(code)}>
                <MDBIcon icon="trash" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Body;
