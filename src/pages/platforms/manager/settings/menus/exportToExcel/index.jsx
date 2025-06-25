import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
} from "mdbreact";
import { useEffect, useState } from "react";
import {
  fullName,
  MenusToExcel,
  MenusToPDF,
} from "../../../../../../services/utilities";
import { useSelector } from "react-redux";
import BodySwitcher from "./bodySwitcher";
import { HMO } from "../../../../../../services/fakeDb";
import Swal from "sweetalert2";

const _form = {
  menuType: "inhouse",
  priceCategories: [{ value: "opd", text: "Srp" }],
};
export default function ExportToExcel({ show, toggle }) {
  const { auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ menus }) => menus),
    [form, setForm] = useState(_form);

  useEffect(() => {
    if (show) {
      //RESET FORM EVERY EXPORT
      setForm(_form);
    }
  }, [show]);

  const getMenusHavePrice = (menus) => {
    if (form.menuType === "ctr") {
      return menus.filter((menu) => menu[form?.insource?.contract] > 0);
    }
    if (form.menuType === "mbs") {
      return menus.filter(({ opd }) => opd > 0);
    }
    if (form.menuType === "hmo") {
      return menus.filter(({ hmo }) => HMO.getSrp(form.hmo, hmo) > 0);
    }
    return menus;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { menuType, insource, hmo, priceCategories = [] } = form;

    const sortedCollections = [...collections].sort((a, b) => {
      const nameA = (a?.description || a?.abbreviation || "").toLowerCase();
      const nameB = (b?.description || b?.abbreviation || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });

    const menus = getMenusHavePrice(sortedCollections);
    const noMenusFound = menus.length === 0;

    // 🔁 Reusable alert helper
    const showWarning = (title, text) => {
      return Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    };

    // 🚩 Checks per menuType
    if (menuType === "inhouse" && priceCategories.length === 0) {
      return showWarning(
        "Price Categories Required",
        "Please select at least one price category before exporting."
      );
    }

    if (menuType === "hmo") {
      if (!hmo) {
        return showWarning(
          "HMO Required",
          "Please select an HMO before exporting."
        );
      }
      if (noMenusFound) {
        return showWarning(
          "No HMO Prices Found",
          "There are no HMO prices set for any of the menus. Please set HMO prices before exporting."
        );
      }
    }

    if (menuType === "ctr") {
      if (!insource?._id && !insource?.contract) {
        return showWarning(
          "Contract Required",
          "Please select a contract before exporting."
        );
      }
      if (noMenusFound) {
        const contracts = { sbc: "Subcontract", ssc: "Special Subcontract" };
        const contract = contracts[insource?.contract] || "Contract";
        return showWarning(
          `No ${contract} Prices Found`,
          `There are no ${contract} prices set for any of the menus. Please set contract prices before exporting.`
        );
      }
    }

    if (menuType === "mbs") {
      if (!insource?._id && !insource?.membership) {
        return showWarning(
          "Membership Required",
          "No membership is selected. Please choose a membership before exporting."
        );
      }
    }

    const _form = {
      ...form,
      priceCategories: form.priceCategories.sort((a, b) => {
        return a.value === "opd" ? -1 : b.value === "opd" ? 1 : 0;
      }),
    };
    const result = await Swal.fire({
      icon: "info",
      title: "Are you sure you want to export this menus price list??",
      text: "This will generate both a PDF and Excel file.",
      showCancelButton: true,
      confirmButtonText: "Yes, export it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      MenusToExcel({
        menus,
        form: _form,
        createdBy: fullName(auth.fullName),
      });

      await MenusToPDF({
        menus,
        form: _form,
        createdBy: fullName(auth.fullName),
      });
    }
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
            { text: "Membership", value: "mbs" },
            { text: "Contract", value: "ctr" },
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
