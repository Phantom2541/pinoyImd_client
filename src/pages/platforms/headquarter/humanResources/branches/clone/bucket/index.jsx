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
import {
  currency,
  globalSearch,
} from "../../../../../../../services/utilities";
import dragAndDrop from "../../../../../../../assets/drag-and-drop.png";
import {
  SetCLONE,
  SetCLONE_WARNING,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import { capitalize } from "lodash";
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
    const isSameItem = clone[toKey].collections.some(
      (c) => c.deleted === false && c.oldId === item._id
    );
    if (isSameItem) return;
    if (item.deleted) return;
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
        !c.overwrite &&
        item.branchId !== clone?.[toKey]?._id
    );
    const deletedTo = [...(clone?.[toKey]?.deleted || [])];
    if (isOverwrite) {
      const fromBranchName =
        utils.getBranchName(clone?.[fromKey]?._id, branches) || "";
      const toBranchName =
        utils.getBranchName(clone?.[toKey]?._id, branches) || "";

      Swal.fire({
        icon: "warning",
        title: "Overwrite Confirmation",
        html: `
    <p style="font-size: 15px; line-height: 1.5;">
      The ${clone.type} item <strong style="font-size: 22px;">${utils
          .getName(item)
          ?.toUpperCase()}</strong> already exists in 
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
      const oldItem = { ...toCollections[index] };
      const isDeletedOld = oldItem?.deleted;
      //kapag ang scenario is nilagay niya sa kabilang cluster tas dinelete niya sa kaniya
      //then yung sa isang cluster na pinalagyan niya is ibinalik lang ulit sa kaniya
      //para kung undo lang ibig sabihin wlang changes
      const isUndo = item?.branchId === clone?.[toKey]?._id;
      const { _id = "", ...rest } = item;
      toCollections[index] = {
        ...rest,
        deleted: false,
        overwrite: isUndo ? false : isDeletedOld ? true : false,
        new: isUndo ? false : isDeletedOld ? false : true,
        oldId: _id,
        ...(isDeletedOld && { _id: oldItem?._id }),
      };
      if (isDeletedOld) {
        //kung deleted na yung dati niya..hindi na siya idedelete iooverride nalang ng bago
        //then tatanggalin yung data niya dun sa deleted list
        const deletedIndex = deletedTo.findIndex((d) => d._id === oldItem?._id);
        deletedTo.splice(deletedIndex, 1);
      }
    }

    dispatch(
      SetCLONE({
        ...clone,
        [fromKey]: { ...clone[fromKey], collections: fromCollections },
        [toKey]: {
          ...clone[toKey],
          collections: toCollections,
          deleted: deletedTo,
        },
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

    const deletedTo = isFrom
      ? [...(clone?.to?.deleted || [])]
      : utils.sort(
          branches.find((branch) => branch._id === clone?.to?._id)?.[clone.type]
        );

    const cloneCollections = isFrom
      ? collections.map((item) => {
          //ichcheck muna yung deleted ng clone.to
          //kapag yung item ng icoclone is nandun sa deleted to tatanggalin siya dun
          //then yung bagong icoclone na item is magiging overwrite true na siya
          const index = deletedTo.findIndex(
            (d) => utils.getName(d) === utils.getName(item)
          );

          const deletedId = index > -1 ? deletedTo[index]?._id : null;

          if (index > -1) {
            deletedTo.splice(index, 1);
          }
          const { _id, ...rest } = item;

          return {
            ...rest,
            overwrite: index > -1 ? true : false,
            new: index > -1 ? false : true,
            deleted: false,
            ...(index > -1 && { _id: deletedId }),
          };
        })
      : new Array(collections.length).fill({});

    if (isFrom && overwriteItems.length > 0) {
      return dispatch(SetCLONE_WARNING(overwriteItems));
    }
    dispatch(
      SetCLONE({
        ...clone,
        to: {
          ...clone.to,
          collections: cloneCollections,
          //remove all get the orginal menus from branches then declare as deleted
          deleted: deletedTo,
        },
      })
    );
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = (item) => {
    const deleted = [...(clone[identifier]?.deleted || [])];
    const menus = [...clone[identifier].collections];
    const index = menus.findIndex(
      (m) => utils.getName(m) === utils.getName(item)
    );
    menus[index] = { ...item, deleted: true, overwrite: false, new: false };
    if (item.branchId === clone?.[identifier]?._id || item?.overwrite) {
      deleted.push(item);
    }
    dispatch(
      SetCLONE({
        ...clone,
        [identifier]: { ...clone[identifier], collections: menus, deleted },
      })
    );
  };

  const handleUndo = () => {
    const _clone = utils.changeBranch(
      identifier,
      clone?.[identifier]?._id,
      clone,
      branches
    );
    dispatch(
      SetCLONE({
        ..._clone,
        [identifier]: { ..._clone?.[identifier], deleted: [] },
      })
    );
  };

  const length = collections.filter(
    (item) => !item?.deleted && Object.keys(item).length
  ).length;

  const changes =
    collections.filter(
      (item) => (item?.new || item?.overwrite) && Object.keys(item).length
    ).length + clone?.[identifier]?.deleted?.length || 0;

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
              maxHeight: "400px",
              overflow: "auto",
              minHeight: "400px",
            }}
            ref={containerRef}
          >
            <MDBTable small>
              <thead className="sticky" style={{ top: "0", zIndex: 1 }}>
                <tr>
                  <th className="fw-bold py-1" colSpan={3}>
                    <div className="d-flex align-items-center w-100 ">
                      <div className="d-flex align-items-center flex-grow-1">
                        <span className="text-nowrap mr-2">
                          {capitalize(clone?.type)}{" "}
                          {length ? `(${length})` : ``}
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
                      <tr
                        key={`${collection._id}-${index}-${identifier}`}
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
                        <td>
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
                          </div>
                        </td>
                        <td style={{ fontWeight: 400 }}>
                          {!isDummy && (
                            <span>{currency.format(collection?.opd)}</span>
                          )}
                        </td>
                        <td>
                          {!isDummy && (
                            <MDBBtn
                              size="sm"
                              color="danger"
                              rounded
                              className="px-2 m-0 py-0 float-right"
                              onClick={() => handleRemove(collection)}
                            >
                              <MDBIcon icon="minus" />
                            </MDBBtn>
                          )}
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
          <MDBBtn
            size="sm"
            color="warning"
            block
            disabled={changes === 0}
            onClick={handleUndo}
            className="fw-bold"
            style={{ fontSize: ".7rem" }}
          >
            <MDBIcon icon="sync" className="mr-1" /> UNDO{" "}
            {changes ? `(${changes})` : ""} CHANGES{" "}
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Bucket;
