import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../../../../../../services/utilities";
import dragAndDrop from "../../../../../../assets/drag-and-drop.png";
import { SetCLONE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import { capitalize } from "lodash";

const Bucket = ({ identifier = "from" }) => {
  const [clusters, setClusters] = useState([]);
  const { clone } = useSelector(({ menus }) => menus);
  const { collections = [] } = clone[identifier] || {};
  const dispatch = useDispatch();
  const length = collections.length;

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (e) => {
      const other = document.getElementById(
        identifier === "from" ? "to-bucket" : "from-bucket"
      );
      if (other && !other.isSyncing) {
        other.isSyncing = true;
        other.scrollTop = e.target.scrollTop;
        other.isSyncing = false;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [identifier]);

  useEffect(() => {
    setClusters(collections);
  }, [collections]);
  const handleSearch = ({ target }) => {
    if (!target.value) return setClusters(collections);
    const results = globalSearch(collections, target.value);
    setClusters(results);
  };

  const handleDragStart = (e, item, fromList) => {
    const dragPreview = document.createElement("div");
    dragPreview.textContent = item.name || item.abbreviation;
    Object.assign(dragPreview.style, {
      position: "absolute",
      top: "0",
      left: "0",
      padding: "8px 12px",
      width: "10rem",
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
    if (!clone?.to?._id) {
      Swal.fire({
        icon: "warning",
        title: "Select a Target Branch",
        text: "Please choose the branch where you want to clone the data before proceeding.",
        confirmButtonText: "Got it!",
      });
      return;
    }

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, fromList })
    );
  };

  const moveItem = (fromKey, toKey, item) => {
    const fromCollections = [...clone[fromKey].collections];
    const toCollections = [...clone[toKey].collections];
    const itemName = item.name || item.abbreviation;

    const index = fromCollections.findIndex(
      (c) => (c.name || c.abbreviation) === itemName
    );
    const isExist = toCollections.some(
      (c) => (c.name || c.abbreviation) === itemName
    );
    if (index > -1 && isExist) {
      // fromCollections.splice(index, 1);
    } else if (!isExist) {
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
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { item, fromList } = JSON.parse(data);
    if (fromList === toList) return;
    moveItem(fromList, toList, item);
  };
  const isFrom = identifier === "from";

  const handleAction = () => {
    const cloneCollections = isFrom ? clone?.from?.collections : [];
    dispatch(
      SetCLONE({
        ...clone,
        to: { ...clone.to, collections: cloneCollections },
      })
    );
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = (item) => {
    const menus = [...clone[identifier].collections];
    const index = menus.findIndex((m) => m._id === item._id);
    menus.splice(index, 1);
    dispatch(
      SetCLONE({
        ...clone,
        [identifier]: { ...clone[identifier], collections: menus },
      })
    );
  };
  return (
    <MDBCol
      onDrop={(e) => handleDrop(e, identifier)}
      onDragOver={handleDragOver}
    >
      <MDBCard>
        <MDBCardBody className="p-1">
          <div
            id={`${identifier}-bucket`}
            style={{
              maxHeight: "300px",
              overflow: "auto",
              minHeight: "300px",
            }}
            ref={containerRef}
          >
            <MDBTable small>
              <thead className="sticky" style={{ top: "0", zIndex: 1 }}>
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
                      <MDBBtn
                        size="sm"
                        onClick={handleAction}
                        className="px-2"
                        color={isFrom ? "success" : "danger"}
                      >
                        {!isFrom && (
                          <MDBIcon fas icon="trash" className="mr-1" />
                        )}
                        {isFrom ? "Clone all" : "Remove All"}
                        {isFrom && (
                          <MDBIcon fas icon="share-square" className="ml-1" />
                        )}
                      </MDBBtn>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clusters.length > 0 ? (
                  clusters.map((collection, index) => {
                    const { name = "", abbreviation = "" } = collection;
                    const { to = {}, from = {} } = clone || {};
                    const others =
                      identifier === "from" ? to.collections : from.collections;
                    const isExist = others?.some(
                      (c) =>
                        (c.name || c.abbreviation) ===
                        (collection.name || collection.abbreviation)
                    );
                    const isDummy = collection?._id ? false : true;
                    return (
                      <tr key={collection._id}>
                        <td
                          onDrop={(e) => handleDrop(e, identifier)}
                          onDragOver={handleDragOver}
                          className={`cursor-pointer ${isDummy && "bg-light"} ${
                            !isExist && !isDummy && "bg-info text-white"
                          }`}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, collection, identifier)
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              {index + 1}.
                              <span
                                style={{ fontWeight: "400" }}
                                className="ml-1"
                              >
                                {capitalize(name || abbreviation)}
                              </span>
                            </div>
                            {!isDummy && (
                              <MDBBtn
                                size="sm"
                                color="danger"
                                rounded
                                className="px-2 m-0 py-1"
                                onClick={() => handleRemove(collection)}
                              >
                                <MDBIcon icon="minus" />
                              </MDBBtn>
                            )}
                          </div>
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
