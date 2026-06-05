import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBModalBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from "mdbreact";
import { Services } from "../../../../../../../../services/fakeDb";

const Census = ({ census }) => {
  const [activeTab, setActiveTab] = useState("menus"),
    { collections } = useSelector(({ menus }) => menus),
    tabStyle = (tab) =>
      `w-50 ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`;

  const getServiceCount = (value) => {
    if (value && typeof value === "object") {
      return Number(value.sum ?? 0) || Number(value.walkin || 0) + Number(value.referral || 0);
    }

    return Number(value || 0);
  };

  return (
    <MDBModalBody className="mb-0">
      <div className="mb-3 d-flex">
        <MDBBtn
          className={tabStyle("menus")}
          onClick={() => setActiveTab("menus")}
        >
          Menus
        </MDBBtn>
        <MDBBtn
          className={tabStyle("services")}
          onClick={() => setActiveTab("services")}
        >
          Services
        </MDBBtn>
      </div>
      {/* Menus Table */}
      {activeTab === "menus" && (
        <MDBTable bordered small>
          <MDBTableHead>
            <tr>
              <th>#</th>
              <th>Test</th>
              <th>Count</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {Object.entries(census.menus).map(([id, count], idx) => {
              const abbreviation =
                collections.find(({ _id }) => _id === id)?.abbreviation || id;
              return (
                <tr key={id}>
                  <td>{idx + 1}</td>
                  <td>{abbreviation}</td>
                  <td>{count}</td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      )}

      {/* Services Table */}
      {activeTab === "services" && (
        <MDBTable bordered small>
          <MDBTableHead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Count</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {Object.entries(census.services).map(([id, count], idx) => {
              const name = Services.getName(id);
              return (
                <tr key={id}>
                  <td>{idx + 1}</td>
                  <td>{name}</td>
                  <td>{getServiceCount(count)}</td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      )}
    </MDBModalBody>
  );
};

export default Census;
