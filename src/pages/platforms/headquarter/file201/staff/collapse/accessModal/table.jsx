import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBView,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import "./index.css";

const Table = ({
  collections,
  isTag = false,
  search = "",
  handleAction = () => {},
  handleSearch = () => {},
}) => {
  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className={`gradient-card-header ${
          isTag ? "green" : "blue"
        } narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center`}
      >
        <div className="d-flex align-items-center" style={{ width: "20rem" }}>
          <span className="white-text mx-3 text-nowrap mt-2">
            {isTag ? "Tag" : ""} Access
          </span>
        </div>
        <div>
          {!isTag && (
            <input
              type="search"
              className="roles-search"
              value={search}
              placeholder="Search.."
              onChange={({ target }) => handleSearch(target.value)}
            />
          )}
        </div>
      </MDBView>
      <MDBCardBody>
        <div
          style={{ maxHeight: "440px", overflowY: "auto" }}
          className="custom-scroll"
        >
          <table style={{ width: "100%" }} border={1}>
            <MDBTableHead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Platform</th>
                <th className="text-center">Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {collections?.length > 0 ? (
                collections.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-start" style={{ fontWeight: 400 }}>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {item[isTag ? "platform" : "name"]}{" "}
                    </td>
                    <td className="text-center">
                      <MDBBtn
                        size="sm"
                        color={isTag ? "danger" : "info"}
                        rounded
                        onClick={() => handleAction(item)}
                      >
                        <MDBIcon icon={isTag ? "trash" : "share"} />
                      </MDBBtn>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    {isTag
                      ? "No tag access"
                      : "No results try another keywords."}
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </table>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Table;
