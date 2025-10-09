import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../../../../../../../services/utilities";
import dragAndDrop from "../../../../../../../assets/drag-and-drop.png";
import {
  SetCLONE,
  SetCLONE_WARNING,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import { capitalize, over } from "lodash";
import utils from "../utils";

const Bucket = ({ identifier = "from" }) => {
  const [clusters, setClusters] = useState([]);
  const { clone } = useSelector(({ menus }) => menus);
  const { collections = [] } = clone[identifier] || {};
  const { collections: branches } = useSelector(({ branches }) => branches);
  const dispatch = useDispatch();

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

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, fromList })
    );
  };

  const moveItem = (fromKey, toKey, item) => {
    const fromCollections = [...clone[fromKey].collections];
    const toCollections = [...clone[toKey].collections];
    const itemName = utils.getName(item);

    const index = fromCollections.findIndex(
      (c) => utils.getName(c) === itemName
    );
    const isExistInTo = toCollections.some(
      (c) => utils.getName(c) === itemName && !c.deleted
    );
    const isOverwrite = toCollections.some(
      (c) =>
        utils.getName(c) === itemName &&
        item._id !== c._id &&
        !c.deleted &&
        !c.overwrite
    );
    if (isOverwrite) {
      const fromBranchName =
        utils.getBranchName(clone?.from?._id, branches) ||
        "General Tinio Branch";
      const toBranchName =
        utils.getBranchName(clone?.to?._id, branches) || "Pantabangan Branch";

      Swal.fire({
        icon: "warning",
        title: "Overwrite Confirmation",
        html: `
    <p style="font-size: 15px; line-height: 1.5;">
      The menu item <strong>${utils.getName(item)}</strong> already exists in 
      <strong>${toBranchName}</strong>.<br><br>
      If you proceed, the existing information in 
      <strong>${toBranchName}</strong> will be <b>replaced</b> with the one from 
      <strong>${fromBranchName}</strong>.<br><br>
      Are you sure you want to overwrite it?
    </p>
  `,
        showCancelButton: true,
        confirmButtonText: "Yes, overwrite it",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with overwrite
          const toIndex = toCollections.findIndex(
            (c) => utils.getName(c) === itemName
          );
          const { _id, ...rest } = item;
          toCollections[toIndex] = {
            ...rest,
            overwrite: true,
            new: false,
            deleted: false,
            _id: toCollections[toIndex]?._id,
          };

          dispatch(
            SetCLONE({
              ...clone,
              [toKey]: { ...clone[toKey], collections: toCollections },
            })
          );
        }
      });
      return; // stop further execution
    }

    if (!isExistInTo) {
      const { _id, ...rest } = item;

      toCollections[index] = {
        ...rest,
        deleted: false,
        overwrite: false,
        new: true,
      };
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
    if (!clone?.to?._id) {
      Swal.fire({
        icon: "warning",
        title: "Select a Target Branch",
        text: "Please choose the branch where you want to clone the data before proceeding.",
        confirmButtonText: "Got it!",
      });
      return;
    }
    const { item, fromList } = JSON.parse(data);
    if (fromList === toList) return;
    moveItem(fromList, toList, item);
  };
  const isFrom = identifier === "from";

  const handleAction = () => {
    const { from = {}, to = {} } = clone;
    const { collections = [] } = from;
    const overwriteItems = to.collections.filter((toItem) => {
      const match = collections.find(
        (fromItem) =>
          utils.getName(fromItem) === utils.getName(toItem) &&
          fromItem._id !== toItem._id &&
          !fromItem.deleted &&
          !fromItem.overwrite &&
          fromItem._id
      );
      return match && !toItem.overwrite && !toItem.deleted && toItem._id;
    });

    const cloneCollections = isFrom
      ? collections
      : new Array(collections.length).fill({});

    if (isFrom && overwriteItems.length > 0) {
      return dispatch(SetCLONE_WARNING(overwriteItems));
    }
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
    const index = menus.findIndex(
      (m) => utils.getName(m) === utils.getName(item)
    );
    menus[index] = { ...item, deleted: true, overwrite: false, new: false };
    dispatch(
      SetCLONE({
        ...clone,
        [identifier]: { ...clone[identifier], collections: menus },
      })
    );
  };

  const length = collections.filter(
    (item) => !item?.deleted && Object.keys(item).length
  ).length;

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
                        disabled={!clone?.to?._id}
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
                        utils.getName(c) === utils.getName(collection) &&
                        !c.deleted
                    );
                    const isDummy =
                      Object.keys(collection).length && !collection.deleted
                        ? false
                        : true;
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
                                {isDummy
                                  ? ""
                                  : capitalize(name || abbreviation)}
                              </span>
                            </div>
                            {!isDummy && (
                              <MDBBtn
                                size="sm"
                                color="danger"
                                rounded
                                className="px-2 m-0 py-0"
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
          {/* <MDBBtn size="sm" color="warning" block disabled={!clone}>
            <MDBIcon icon="sync" className="mr-1" /> UNDO CHANGES
          </MDBBtn> */}
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Bucket;
