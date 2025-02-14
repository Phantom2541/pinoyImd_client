import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
} from "mdbreact";
// import {
//   SAVE,
//   UPDATE,
// } from "../../../../../../services/redux/slices/assets/persons/personnels";
// import { isEqual } from "lodash";
// import { useToasts } from "react-toast-notifications";

// const _form = {
//   name: "",
// };

export default function Modal({ show, toggle, selected, willCreate }) {
  // const { token } = useSelector(({ auth }) => auth),
  //   [form, setForm] = useState(_form),
  //   { addToast } = useToasts(),
  //   dispatch = useDispatch();

  // const handleUpdate = () => {
  //   toggle();

  //   // check if object has changed
  //   if (isEqual(form, selected))
  //     return addToast("No changes found, skipping update.", {
  //       appearance: "info",
  //     });

  //   dispatch(
  //     UPDATE({
  //       data: { ...form, _id: selected._id },
  //       token,
  //     })
  //   );

  //   setForm(_form);
  // };

  // const handleCreate = () => {
  //   dispatch(
  //     SAVE({
  //       data: form,
  //       token,
  //     })
  //   );

  //   setForm(_form);
  //   toggle();
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (willCreate) {
  //     return handleCreate();
  //   }

  //   handleUpdate();
  // };

  // use for direct values like strings and numbers
  // const handleValue = (key) =>
  //   willCreate ? form[key] : form[key] || selected[key];

  // const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Role"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stocks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </MDBTable>
      </MDBModalBody>
    </MDBModal>
  );
}
