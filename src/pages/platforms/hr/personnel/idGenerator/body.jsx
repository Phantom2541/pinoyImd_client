import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import {
  billingAddress,
  Cloudinary,
  fullName,
  mobile,
} from "../../../../../services/utilities";
import {
  TOGGLE,
  UPDATE,
  SetFILTERED,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { Policy } from "../../../../../services/fakeDb";
import {
  EditableUser,
  EditableField,
} from "../../../../../components/customizable";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess, formSubmitted } =
      useSelector(({ personnels }) => personnels),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleUpdate = (data) => {
    console.log("data", data);

    dispatch(UPDATE({ token, data })).then(({ payload: staff }) => {
      // update filtered list locally
      const Avatar = `/users/${staff?.user?.email}/profile.jpg`;
      const Signature = `/users/${staff?.user?.email}/signature.png`;
      const empName = `${staff.user.title || ""} ${fullName(
        staff.user.fullName,
        false,
        true
      )
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())}`;
      const guardian = staff.user?.guardian?.fullName;
      const position = Policy.getPositions(staff?.contract?.designation),
        department = Policy.getDepartment(staff?.contract?.designation);
      const pn = mobile(staff?.user?.mobile);
      const idfiltered = {
        _id: staff._id,
        front: {
          empID: staff.id,
          img: Avatar,
          emp: empName,
          position,
          department,
        },
        back: {
          signature: Signature,
          dob: new Date(staff.user.dob)
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            .replace(" ", ", "),
          address: billingAddress(staff.user.address),
          guardian,
          pn,
        },
        dfp: staff.dfp,
      };
      const newFiltered = filtered.map((staff) =>
        staff._id === idfiltered._id ? idfiltered : staff
      );
      dispatch(SetFILTERED(newFiltered));
    });
  };

  const handleSelected = (index) => dispatch(TOGGLE(index + startIndex));

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = (filtered || []).slice(startIndex, endIndex); // Get only items for the active page
  console.log("paginatedData", paginatedData);

  console.log("paginatedData", paginatedData);
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Position</th>
          <th>Address</th>
          <th>Primary contact</th>
          <th>Signature</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((staff, index) => {
          const { front, back, _id } = staff;

          const { img, emp, empID, position, department } = front;
          const { address, guardian, guardianId, pn, signature } = back;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <img
                  src={`${Cloudinary.getEndpoint()}/${img}`}
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              <td>
                <div className="d-flex flex-column">
                  <h4>{emp}</h4>
                  <EditableField
                    keyForValue="id"
                    fieldData={{ _id, id: empID }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </div>
              </td>
              <td>
                <h5>{position}</h5>
                {department}
              </td>
              <td>{address}</td>
              <td>
                <EditableUser
                  user={{ guardian, _id }} // unique key for each user
                  placeHolder="Primary Contact..."
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                  onSave={(data) => console.log("onsave data:", data)}
                />
                <div className="d-flex flex-column">
                  <EditableField
                    type="number"
                    keyForValue="id"
                    fieldData={{ guardianId, id: pn }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </div>
              </td>
              <td>
                <img
                  src={`${Cloudinary.getEndpoint()}/${signature}`}
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => handleSelected(index)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
