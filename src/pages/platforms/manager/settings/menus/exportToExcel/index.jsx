import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
} from "mdbreact";
import { useState } from "react";
import { fullName, MenusToExcel } from "../../../../../../services/utilities";
import { useSelector } from "react-redux";
import BodySwitcher from "./bodySwitcher";

export default function ExportToExcel({ show, toggle }) {
  const { auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ menus }) => menus),
    [form, setForm] = useState({
      menuType: "",
      priceCategories: [],
    });
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const sortedCollections = [...collections].sort((a, b) => {
      const nameA = (a?.description || a?.abbreviation || "").toLowerCase();
      const nameB = (b?.description || b?.abbreviation || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
    MenusToExcel({
      array: sortedCollections,
      form: {
        ...form,
        priceCategories: form.priceCategories.sort((a, b) => {
          return a.value === "opd" ? -1 : b.value === "opd" ? 1 : 0;
        }),
      },
      createdBy: fullName(auth.fullName),
    });
  };

  return (
    <MDBModal isOpen={show} toggle={() => toggle()} backdrop>
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="file-export" className="mr-2" />
        Export menus price list
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography noteTitle="Export Options: " note noteColor="success">
            Which menu price list would you like to export:
          </MDBTypography>
          {[
            { text: "In-House", value: "inhouse" },
            { text: "Membership", value: "membership" },
            { text: "Contract", value: "contract" },
            { text: "HMO", value: "hmo" },
          ].map((menuType, index) => {
            return (
              <div key={index} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="menuType"
                  checked={form.menuType === menuType.value}
                  onChange={() =>
                    setForm({ ...form, menuType: menuType.value })
                  }
                  id={`menuType${index}`}
                  value={menuType.value}
                />
                <label
                  className="form-check-label"
                  htmlFor={`menuType${index}`}
                >
                  {menuType.text}
                </label>
              </div>
            );
          })}

          {form.menuType && <BodySwitcher form={form} setForm={setForm} />}
          <div className="text-center mb-1-half mt-4">
            <MDBBtn type="submit" color="info" className="mb-2" rounded>
              Export
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
