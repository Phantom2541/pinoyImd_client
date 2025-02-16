import React, { useState, useEffect } from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb";
import DataTable from "../../../../../../components/dataTable";
import { capitalize, globalSearch } from "../../../../../../services/utilities";

export default function Modal({ show, toggle, handlePick }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(Services.collections);
  }, []);

  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setServices(globalSearch(Services.collections, key));
    } else {
      setServices(Services.collections);
    }
  };

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="flask" className="mr-2" />
        Add a Service
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <DataTable
          minHeight="0px"
          title="Services Available"
          array={services}
          actions={[
            {
              _icon: "share",
              _function: handlePick,
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
              _text: "Department",
            },
          ]}
          tableBodies={[
            {
              _key: "name",
              _format: (data, { abbreviation }) => (
                <>
                  <p className="fw-bold mb-1">{capitalize(data)}</p>
                  <p className="mb-0">{abbreviation.toUpperCase()}</p>
                </>
              ),
            },
            {
              _key: "department",
              _format: capitalize,
            },
          ]}
          handleSearch={handleSearch}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
