import React, { useCallback, useEffect, useState } from "react";
import { MDBCard, MDBRow, MDBCardBody, MDBAnimation } from "mdbreact";
import "./style.css";
import List from "./list";
import { useDispatch, useSelector } from "react-redux";
import {
  SetClusters,
  SetCollections,
} from "../../../services/redux/slices/reusable/dragDrop";
const DragDrop = () => {
  const { clusters, collections: c } = useSelector(({ dragDrop }) => dragDrop),
    [hasDrag, setHasDrag] = useState(false),
    [collections, setCollections] = useState([]),
    [disabled, setDisabled] = useState(false),
    [removeID, setRemoveID] = useState(-1),
    [removeBy, setRemoveBy] = useState(""),
    [addID, setAddID] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    setCollections(c);
    console.log("running", c);
  }, [c]);
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
    console.log("title", title);
    const { collections } = getState(title);
    setHasDrag(true);
    // setRemoveID(role._id);
    // setRemoveBy(title);
    setDisabled(true);
    setTimeout(() => {
      setRemoveID(-1);
      setDisabled(false);

      // _collections.splice(index, 1);
      // dispatch(setter(_collections));
    }, 200);

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
    var { role, dragBy } = JSON.parse(data);
    var { collections: dynamicCollections, setter } = getState(dropTo);
    console.log("drag by", dragBy);
    console.log("dropTo to", dropTo);
    if (dragBy === dropTo) return console.log("same drag and drop");
    setRemoveBy("List");
    setRemoveID(role._id);
    setTimeout(() => {
      const _collections = [...collections];
      const index = _collections.findIndex(({ _id }) => _id === role._id);
      _collections.splice(index, 1);
      dispatch(SetCollections(_collections));
    }, 200);

    dispatch(setter([role, ...dynamicCollections]));
    setAddID(role._id);
  };

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard>
        <MDBCardBody>
          <MDBRow>
            <List
              collections={collections}
              addID={addID}
              removeID={removeID}
              removeBy={removeBy}
              disabled={disabled}
              hasDrag={hasDrag}
              title="List"
              tableName="List"
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
            <List
              collections={clusters}
              disabled={disabled}
              removeID={removeID}
              removeBy={removeBy}
              addID={addID}
              handleDrop={handleDrop}
              tableName="Selected"
              title="Selected"
              hasDrag={hasDrag}
              handleDragStart={handleDragStart}
            />
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
};

export default DragDrop;
