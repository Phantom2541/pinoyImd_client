import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../../../../../../services/utilities";
import dragAndDrop from "../../../../../../assets/drag-and-drop.png";
import { SetCLONE } from "../../../../../../services/redux/slices/commerce/catalog/menus";

const Bucket = ({ identifier = "by" }) => {
  const [clusters, setClusters] = useState([]);
  const { clone } = useSelector(({ menus }) => menus);
  const { collections = [], to = {}, by = {} } = clone[identifier] || {};
  const dispatch = useDispatch();
  const length = collections.length;

  useEffect(() => setClusters(collections), [collections]);
  const handleSearch = ({ target }) => {
    if (!target.value) return setClusters(collections);
    const results = globalSearch(collections, target.value);
    setClusters(results);
  };

  const handleDragStart = (e, item, fromList) => {
    if (!to?._id) return console.log("Select clone to branch!!!");
    const dragPreview = document.createElement("div");
    dragPreview.textContent = item.name;
    Object.assign(dragPreview.style, {
      position: "absolute",
      top: "0",
      left: "0",
      padding: "8px 12px",
      width: "15rem",
      background: "white",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 50px rgba(172, 161, 161, 0.2)",
      fontSize: "1rem",
      fontWeight: "500",
      color: "#333",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
    });

    document.body.appendChild(dragPreview);

    // Set as drag image
    e.dataTransfer.setDragImage(
      dragPreview,
      dragPreview.clientWidth / 2,
      dragPreview.clientHeight / 2
    );
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, fromList })
    );
  };

  const moveItem = (fromKey, toKey, item) => {
    const fromCollections = [...clone[fromKey].collections];
    const toCollections = [...clone[toKey].collections];

    const index = fromCollections.findIndex((c) => c._id === item._id);
    if (index !== -1) {
      fromCollections.splice(index, 1);
      toCollections.unshift(item);
    }

    dispatch(
      SetCLONE({
        ...clone,
        [fromKey]: { ...clone[fromKey], collections: fromCollections },
        [toKey]: { ...clone[toKey], collections: toCollections },
      })
    );
  };

  const handleDrop = (e, toList) => {
    e.preventDefault();
    console.log("handleDrop", toList);
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { item, fromList } = JSON.parse(data);
    if (fromList === toList) return;
    moveItem(fromList, toList, item);
  };
  const handleDragOver = (e) => e.preventDefault();
  return (
    <MDBCol
      onDrop={(e) => handleDrop(e, identifier)}
      onDragOver={handleDragOver}
    >
      <MDBCard
        onDrop={(e) => handleDrop(e, identifier)}
        onDragOver={handleDragOver}
      >
        <MDBCardBody className="p-1">
          <div
            style={{ maxHeight: "300px", overflow: "auto", minHeight: "300px" }}
          >
            <MDBTable small>
              <thead className="sticky" style={{ top: "0" }}>
                <tr>
                  <th className="fw-bold py-1">
                    <div className="d-flex align-items-center w-100 ">
                      <div className="d-flex align-items-center flex-grow-1">
                        <span className="text-nowrap mr-2">
                          Menus {length ? `(${length})` : ``}
                        </span>
                        <input
                          type="search"
                          className="form-control form-control-sm w-100"
                          onChange={handleSearch}
                          placeholder="Search"
                        />
                      </div>
                      <MDBBtn size="sm" className="px-2" color="primary">
                        Clone all
                        <MDBIcon fas icon="share-square" className="ml-1" />
                      </MDBBtn>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clusters.length > 0 ? (
                  clusters.map((collection, index) => {
                    const { name = "", abbreviation = "" } = collection;
                    return (
                      <tr key={collection._id}>
                        <td
                          className="cursor-pointer"
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, collection, identifier)
                          }
                        >
                          {index + 1}.
                          <span style={{ fontWeight: "500" }} className="ml-1">
                            {name || abbreviation}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr
                    onDrop={(e) => handleDrop(e, identifier)}
                    onDragOver={handleDragOver}
                  >
                    <td style={{ height: "220px", verticalAlign: "middle" }}>
                      {clusters.length === 0 && collections.length > 0 ? (
                        <span className="text-center d-block">
                          No results found. Try another keywords
                        </span>
                      ) : (
                        <>
                          <div className="d-flex flex-column">
                            <p className="text-center">
                              Drag and Drop Menus Here...
                            </p>
                            <img
                              src={dragAndDrop}
                              alt="No Data"
                              style={{
                                height: "10rem",
                                width: "19rem",
                                margin: "0 auto",
                              }}
                            />
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </MDBTable>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Bucket;
