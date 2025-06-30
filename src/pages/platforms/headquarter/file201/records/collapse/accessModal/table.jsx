import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBView,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import "./index.css";

const Table = ({
  collections,
  isTag = false,
  search = "",
  tableName = "Access",
  hasDrag = false,
  handleSearch = () => {},
  handleDragOver,
  handleDragStart,
  handleDrop,
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
          style={{ maxHeight: "440px", overflowY: "auto", minHeight: "440px" }}
          className="custom-scroll"
          onDrop={(event) => handleDrop(event, tableName)}
          onDragOver={handleDragOver}
        >
          <table style={{ width: "100%" }} border={1}>
            <MDBTableHead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Platform</th>
                {/* <th className="text-center">Action</th> */}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {collections?.length > 0 ? (
                collections.map((item, index) => (
                  <tr
                    key={index}
                    onDragStart={(event) =>
                      handleDragStart(event, item, !isTag, tableName)
                    }
                    onDragOver={handleDragOver}
                    className={`${hasDrag ? "cursor-grabbing" : "cursor-grab"}`}
                    draggable
                    style={{
                      height: "36px",
                    }}
                  >
                    <td
                      className="text-center"
                      style={{ padding: "6px", lineHeight: "1.2rem" }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="text-start"
                      style={{
                        fontWeight: 500,
                        lineHeight: "1.2rem",
                        padding: "6px",
                      }}
                    >
                      <div className="ml-3">
                        {item?.platform}
                        <br />
                        {!isTag && <small>{item.description}</small>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center"
                    style={{ padding: "8px", height: "36px" }}
                  >
                    {isTag
                      ? "No tag access"
                      : "No results try another keyword."}
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
