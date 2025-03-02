import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBSelect,
  MDBSelectOption,
  MDBSelectOptions,
  MDBSelectInput,
  MDBFileInput,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/commerce/merchandise/products";
import { add, isEqual, set } from "lodash";
import { useToasts } from "react-toast-notifications";

const _form = {
  name: "",
  subname: "",
  barcode: "",
  revert: false,
  halt: false,
  VATable: false,
  packages: {
    pack: {
      q: 0,
      u: "",
    },
    btl: {
      v: 0,
      u: "",
    },
  },
  conversion: {
    btl: 0,
    pack: 0,
  },
  category: "",
  supplierObj: "",
  isUpload: false,
  isConsumable: false,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [packages, setPackages] = useState(_form.packages),
    [conversion, setConversion] = useState(_form.conversion),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleUpdate = () => {
    toggle();

    dispatch(
      UPDATE({
        data: {
          ...form,
          _id: selected._id,
          branchId: selected?.branchId,
          packages,
          conversion,
        },
        token,
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: {
          ...form,
          branchId: activePlatform?.branchId,
          packages,
          conversion,
        },
        token,
      })
    );

    setForm(_form);
    toggle();
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  useEffect(() => {
    if (selected && selected._id) {
      setForm(selected);
      setPackages(selected.packages);
      setConversion(selected.conversion);
    }
  }, [selected]);

  // use for direct values like strings and numbers
  const handleValue = key =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleOption = option => setForm({ ...form, category: option[0] });

  const handleUpload = event => {
    const file = event[0];
    if (file) {
      if (file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = e => {
          setForm({
            ...form,
            isUpload: true,
            base64: reader.result.split(",")[1],
          });
        };
        reader.readAsDataURL(file);
      } else {
        addToast("Invalid file type", { appearance: "error" });
      }
    }
  };

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
        <form onSubmit={handleSubmit}>
          <MDBInput
            type="text"
            label="Name"
            value={handleValue("name")}
            onChange={e => handleChange("name", e.target.value)}
            required
            icon="heading"
          />
          <MDBInput
            type="text"
            label="Subname"
            value={handleValue("subname")}
            onChange={e => handleChange("subname", e.target.value)}
            icon="audio-description"
          />
          <MDBInput
            type="text"
            label="Barcode"
            value={handleValue("barcode")}
            onChange={e => handleChange("barcode", e.target.value)}
            icon="barcode"
          />
          <MDBInput
            type="text"
            label="Supplier Object"
            value={handleValue("supplierObj")}
            onChange={e => handleChange("supplierObj", e.target.value)}
            icon="user-shield"
          />
          <MDBSelect label={"Category"} getValue={handleOption}>
            <MDBSelectInput selected={form.category} />
            <MDBSelectOptions>
              <MDBSelectOption value="MACHINE">MACHINE</MDBSelectOption>
              <MDBSelectOption value="REAGENTS">REAGENTS</MDBSelectOption>
              <MDBSelectOption value="CONSUMABLE">CONSUMABLE</MDBSelectOption>
            </MDBSelectOptions>
          </MDBSelect>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="checkbox"
                label="Revert"
                id="revert"
                checked={handleValue("revert")}
                onChange={e => handleChange("revert", e.target.checked)}
                icon="undo"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="checkbox"
                id="halt"
                label="Halt"
                checked={handleValue("halt")}
                onChange={e => handleChange("halt", e.target.checked)}
                icon="pause"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                label="VATable"
                type="checkbox"
                id="VATable"
                icon="percent"
                onChange={e => handleChange("VATable", e.target.checked)}
                checked={handleValue("VATable")}
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="checkbox"
                label="Consumable"
                id="isConsumable"
                checked={handleValue("isConsumable")}
                onChange={e => handleChange("isConsumable", e.target.checked)}
                icon="box-open"
              />
            </MDBCol>
          </MDBRow>
          <h4 className="mt-5">Packages:</h4>

          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Pack Quantity"
                value={packages.pack.q}
                onChange={e =>
                  setPackages({
                    ...packages,
                    pack: { ...packages.pack, q: e.target.value },
                  })
                }
                icon="box"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Pack Unit"
                value={packages.pack.u}
                onChange={e =>
                  setPackages({
                    ...packages,
                    pack: { ...packages.pack, u: e.target.value },
                  })
                }
                icon="box"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Bottle Volume"
                value={packages.btl.v}
                onChange={e =>
                  setPackages({
                    ...packages,
                    btl: { ...packages.btl, v: e.target.value },
                  })
                }
                icon="wine-bottle"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Bottle Unit"
                value={packages.btl.u}
                onChange={e =>
                  setPackages({
                    ...packages,
                    btl: { ...packages.btl, u: e.target.value },
                  })
                }
                icon="wine-bottle"
              />
            </MDBCol>
          </MDBRow>
          <h4>Conversion</h4>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Bottle Conversion"
                value={conversion.btl}
                onChange={e =>
                  setConversion({ ...conversion, btl: e.target.value })
                }
                icon="exchange-alt"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Pack Conversion"
                value={conversion.pack}
                onChange={e =>
                  setConversion({ ...conversion, pack: e.target.value })
                }
                icon="exchange-alt"
              />
            </MDBCol>
          </MDBRow>
          <div>
            <MDBFileInput
              reset={true}
              btnTitle="Upload Image"
              textFieldTitle="Upload Image"
              getValue={e => handleUpload(e)}
            />
          </div>
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
