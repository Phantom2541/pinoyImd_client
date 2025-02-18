import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { GENERATE } from "../../../../../services/redux/slices/commerce/menus";
import { Menus, Services } from "../../../../../services/fakeDb";
// declare your expected items
import DataTable from "../../../../../components/dataTable";
export default function Generate({ visible, setVisible }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  //   useEffect(() => {
  //     if (selected._id) setForm(selected);
  //   }, [selected]);

  const handleGenerate = (data) => {
    dispatch(
      GENERATE({
        data: data.map((d) => ({
          ...d,
          branchId: activePlatform?._id,
          description: d.name,
        })),
        token,
      })
    );
    setVisible();
  };

  //   const handleValue = key =>
  //     willCreate ? form[key] : form[key] || selected[key];

  //   const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      size="fluid"
      isOpen={visible}
      toggle={setVisible}
      backdrop
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={setVisible}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="book-open" className="mr-2" />
        Generate Menus
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <DataTable
          isLoading={isLoading}
          title="Menus"
          array={Menus.collections}
          actions={[
            {
              _icon: "download",
              _function: handleGenerate,
              _haveSelect: true,
              _allowMultiple: true,
              _shouldReset: true,
            },
          ]}
          tableHeads={[
            {
              _text: "Name",
            },
            {
              _text: "Abbreviation",
            },
            {
              _text: "Services",
            },
            {
              _text: "SRP",
            },
            {
              _text: "Emergency Room",
            },
            {
              _text: "Charity Ward",
            },
            {
              _text: "Private Ward",
            },
          ]}
          tableBodies={[
            {
              _key: "name",
              _format: (data) => <strong>{data}</strong>,
            },
            {
              _key: "abbreviation",
              _format: (data) => data,
            },
            {
              _key: "packages",
              _format: (data) => {
                let _services = data ? Services.whereIn(data) : [];
                return _services.map((service) => service.name);
              },
            },

            {
              _key: "opd",
              _format: (data) => (
                <input
                  type="number"
                  defaultValue={data}
                  onChange={
                    (e) => console.log(e)
                    // handleChange("capital", e.target.value.toLowerCase())
                  }
                  className="mb-0"
                />
              ),
            },
            {
              _key: "er",
              _format: (data) => (
                <input
                  type="number"
                  defaultValue={data}
                  //   onChange={e =>
                  //     handleChange("capital", e.target.value.toLowerCase())
                  //   }
                  className="mb-0"
                />
              ),
            },
            {
              _key: "cw",
              _format: (data) => (
                <input
                  type="number"
                  defaultValue={data}
                  //   onChange={e =>
                  //     handleChange("capital", e.target.value.toLowerCase())
                  //   }
                  className="mb-0"
                />
              ),
            },
            {
              _key: "pw",
              _format: (data) => (
                <input
                  type="number"
                  defaultValue={data}
                  //   onChange={e =>
                  //     handleChange("capital", e.target.value.toLowerCase())
                  //   }
                  className="mb-0"
                />
              ),
            },
          ]}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
