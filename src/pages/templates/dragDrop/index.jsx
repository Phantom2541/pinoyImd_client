import React, { useCallback, useEffect, useState } from "react";
import { MDBCard, MDBRow, MDBCardBody } from "mdbreact";
import "./style.css";
import List from "./list";
import { useDispatch, useSelector } from "react-redux";
import {
  SetClusters,
  SetCollections,
} from "../../../services/redux/slices/reusable/dragDrop";
const DragDrop = () => {
  const { clusters, collections } = useSelector(({ dragDrop }) => dragDrop),
    [removeID, setRemoveID] = useState(-1),
    [removeBy, setRemoveBy] = useState(""),
    [addID, setAddID] = useState(-1),
    dispatch = useDispatch();

  const getState = useCallback(
    (stateName) => {
      const _collections =
        stateName === "List" ? [...collections] : [...clusters];
      const baseSetter = stateName === "List" ? SetCollections : SetClusters;
      return { collections: _collections, setter: baseSetter };
    },
    [clusters, collections]
  );

  const handleDragStart = (e, role, index, title) => {
    const { collections, setter } = getState(title);
    setRemoveID(index);
    setRemoveBy(title);
    setTimeout(() => {
      const _collections = [...collections];
      setRemoveID(-1);
      setAddID(-1);
      _collections.splice(index, 1);
      dispatch(setter(_collections));
    }, 180);

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        role,
        dragBy: title,
        removeIndex: index,
        collections,
      })
    );
    const dragPreview = document.createElement("div");
    dragPreview.textContent = role.name;
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

    setTimeout(() => {
      if (dragPreview.parentNode) {
        dragPreview.parentNode.removeChild(dragPreview);
      }
    }, 0);
  };

  const handleDrop = (event, dropTo = "List") => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    if (!data) return "unknown role";
    var { role, dragBy, removeIndex } = JSON.parse(data);
    var { collections, setter } = getState(dropTo);
    if (dragBy === dropTo) {
      setTimeout(() => {
        const _collections = [...collections];
        _collections.splice(removeIndex, 0, role);
        dispatch(setter(_collections));
      }, 200);
      setAddID(role._id);
    } else {
      dispatch(setter([role, ...collections]));
    }
    setAddID(role._id);
  };

  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <MDBRow>
            <List
              collections={collections}
              addID={addID}
              removeID={removeID}
              removeBy={removeBy}
              title="List"
              tableName="List"
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
            <List
              collections={clusters}
              removeID={removeID}
              removeBy={removeBy}
              addID={addID}
              handleDrop={handleDrop}
              tableName="Selected"
              title="Selected"
              handleDragStart={handleDragStart}
            />
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default DragDrop;
