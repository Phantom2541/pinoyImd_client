import React, { useState, useEffect } from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import DataTable from "../../../../../components/dataTable";
import { capitalize, globalSearch } from "../../../../../services/utilities";

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
      ></MDBModalHeader>
      <MDBModalBody className="mb-0">
        <SearchUser
          setceo={handleceo}
          label="CEO"
          setUser={(value) =>
            setForm((prev) => ({ ...prev, ceo: value || "" }))
          }
          className="mt-4"
        />
      </MDBModalBody>
    </MDBModal>
  );
}
