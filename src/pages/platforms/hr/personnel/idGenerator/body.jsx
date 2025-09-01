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
import EditableField from "../../../../../components/customizable/editableField";
import { Policy } from "../../../../../services/fakeDb";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess, formSubmitted } =
      useSelector(({ personnels }) => personnels),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleUpdate = ({ _id, key, value }) => {
    let data = { _id };

    // support nested keys like "settings.status"
    if (key?.includes(".")) {
      const keys = key.split(".");
      const nested = keys.reduceRight((acc, curr) => ({ [curr]: acc }), value);
      data = { ...data, ...nested };
    } else {
      data[key] = value;
    }

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
      const guardian = fullName(staff.user?.guardian?.fullName, false, true);
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

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Position</th>
          <th>Contact Person</th>
          <th>Phone</th>
          <th>Signature</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((staff, index) => {
          const { front, back, _id } = staff;

          const { img, emp, empID, position, department } = front;
          const { address, guardian, pn, signature } = back;

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
                    title="Click to edit"
                    width="13rem"
                    type="string"
                    keyForValue="empID"
                    fieldData={{ _id, empID }}
                    onSave={(data) =>
                      handleUpdate({
                        _id: data._id,
                        key: "id",
                        value: data.empID,
                      })
                    }
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </div>
              </td>
              <td>
                <h5>{position}</h5>
                {department}
              </td>
              <td>
                <h5>{guardian}</h5>
                {address}
              </td>

              {/* <td>
                {isSelected && selected.key === "abbreviation" ? (
                  <div style={{ width: "13rem" }}>
                    <Input
                      _key={"value"}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={() => handleUpdate()}
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ id, abbreviation })}>
                    {abbreviation}
                  </strong>
                )}
              </td> */}
              <td>{pn}</td>
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
