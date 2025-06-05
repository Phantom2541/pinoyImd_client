import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardHeader,
  MDBRow,
} from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import {
  SetINHOUSE,
  SetOUTSOURCE,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import dragAndDrop from "../../../../../../assets/drag-and-drop.png";
const Body = ({ setOutSource, outSource }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { inhouse, outsource } = useSelector(({ taskGenerator }) => taskGenerator),
    { collections } = useSelector(({ providers }) => providers),
    [outSources, setOutSources] = useState([]),
    dispatch = useDispatch();

  const { department } = activePlatform;
  const isRadiology = department === "radiology";
  useEffect(() => {
    const _outSources = collections
      .filter(({ vendors }) => vendors)
      .map(({ vendors, category }) => ({
        category,
        text: vendors?.displayname || vendors?.name || "a",
        value: vendors?._id || "a",
      }));

    setOutSources(_outSources);
  }, [collections]);

  const handleDragStart = (e, item, fromList) => {
    if (!outSource && !isRadiology) return console.log("Select outsource!!!");
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

  const handleDrop = (e, toList) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { item, fromList } = JSON.parse(data);
    if (fromList === toList) return;
    if (toList === "outsource" || toList === "official reading") {
      dispatch(SetOUTSOURCE(item));
    } else {
      dispatch(SetINHOUSE(item));
    }

    // Dispatch actions to update Redux state
    dispatch({ type: "REMOVE_FROM_LIST", payload: { item, fromList } });
    dispatch({ type: "ADD_TO_LIST", payload: { item, toList } });
  };

  const handleDragOver = (e) => e.preventDefault();
  const Bucket = ({ collections, title }) => {
    const isOutsource = title === "Outsource";
    const lowerTitle = title.toLowerCase();

    const renderSelect = () => (
      <select
        value={outSource}
        onChange={({ target }) => setOutSource(target.value)}
        className="form-control form-control-sm ml-2 text-primary"
      >
        <option value="" disabled={!!outSource}>
          Select outsource
        </option>
        {outSources.map(({ text, value, category }, index) => (
          <option key={index} value={value}>
            {category === "ghost" && "👻"} {text}
          </option>
        ))}
      </select>
    );

    const renderListItems = () =>
      collections.map((item, index) => (
        <MDBListGroupItem
          key={index}
          style={{
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
          }}
          className="cursor-pointer"
          draggable
          onDragStart={(e) => handleDragStart(e, item, lowerTitle)}
        >
          {item.name}
        </MDBListGroupItem>
      ));

    const renderEmptyState = () => (
      <MDBListGroupItem
        className={isOutsource && !outSource ? "text-start" : "text-center"}
        style={{
          display: "flex",
          border: "none",
          height: "50vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isOutsource && !outSource && !isRadiology ? (
          <h6>
            You need to select an
            <span className="text-primary"> outsource</span> <br />
            to activate the drag and drop
          </h6>
        ) : (
          <div className="d-flex flex-column">
            <p className="text-center">Drag and Drop Services Here...</p>
            <img src={dragAndDrop} alt="No Data" style={{ height: "12rem" }} />
          </div>
        )}
      </MDBListGroupItem>
    );

    return (
      <MDBCol
        onDrop={(e) => handleDrop(e, lowerTitle)}
        onDragOver={handleDragOver}
      >
        <MDBCard className="dragDrop">
          <MDBCardHeader className="bg-light dragDrop d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: 500 }}>{title}</span>
            {isOutsource && !isRadiology && renderSelect()}
          </MDBCardHeader>
          <MDBCardBody
            className="m-0 p-0 dragDrop"
            style={{
              minHeight: !isOutsource ? "24.5rem" : "24rem",
              border: "1px solid #ccc",
            }}
          >
            <MDBListGroup
              style={{
                maxHeight: !isOutsource ? "24.5rem" : "24rem",
                overflowY: "auto",
              }}
              className="summary-scrollbar"
            >
              {collections.length > 0 ? renderListItems() : renderEmptyState()}
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  };

  return (
    <div>
      <MDBRow>
        <Bucket collections={inhouse} title="Inhouse" />
        <Bucket
          collections={outsource}
          title={isRadiology ? "Official Reading" : "Outsource"}
        />
      </MDBRow>
    </div>
  );
};

export default Body;
