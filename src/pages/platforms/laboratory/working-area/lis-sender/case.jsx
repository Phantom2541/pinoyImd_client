import { useEffect, useState } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardHeader,
  MDBRow,
} from "mdbreact";
import { useSelector } from "react-redux";
import dragAndDrop from "../../../../../assets/drag-and-drop.png";
import { Services } from "../../../../../services/fakeDb";
const Case = ({ cluster, setCluster = () => {} }) => {
  const { work, showWorkArea: show } = useSelector(
      ({ validator }) => validator
    ),
    [services, setServices] = useState([]);

  const { task = {} } = work || {};

  useEffect(() => {
    setCluster([]);
    setServices([]);
    if (show) {
      const { packages } = task || {};
      const _services = Array.isArray(packages)
        ? packages
        : Object.keys(packages);
      setCluster(_services);
    }
  }, [show, task, setCluster]);

  const handleDragStart = (e, item, fromList) => {
    const dragPreview = document.createElement("div");
    dragPreview.textContent = Services.find(item)?.name;
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

    const from = fromList === "pending" ? [...services] : [...cluster];
    const to = toList === "pending" ? [...services] : [...cluster];
    const setFrom = fromList === "pending" ? setServices : setCluster;
    const setTo = toList === "pending" ? setServices : setCluster;

    const index = from.indexOf(item);
    if (index > -1) {
      from.splice(index, 1);
      setFrom(from);
      setTo([...to, item]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const Bucket = ({ collections, title, emoji }) => {
    const lowerTitle = title.toLowerCase();

    const renderListItems = () =>
      collections.map((item, index) => (
        <MDBListGroupItem
          key={index}
          style={{
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
          }}
          className="cursor-pointer text-left"
          draggable
          onDragStart={(e) => handleDragStart(e, item, lowerTitle)}
        >
          {Services.find(item)?.name}
        </MDBListGroupItem>
      ));

    const renderEmptyState = () => (
      <MDBListGroupItem
        className={"text-center"}
        style={{
          display: "flex",
          border: "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="d-flex flex-column">
          <p className="text-center">Drag and Drop Services Here...</p>
          <img src={dragAndDrop} alt="No Data" style={{ height: "12rem" }} />
        </div>
      </MDBListGroupItem>
    );

    return (
      <MDBCol
        onDrop={(e) => handleDrop(e, lowerTitle)}
        onDragOver={handleDragOver}
      >
        <MDBCard className="dragDrop">
          <MDBCardHeader className="bg-light dragDrop d-flex justify-content-between align-items-center">
            <div>
              {emoji} <span style={{ fontWeight: 500 }}>{title}</span>
            </div>
          </MDBCardHeader>
          <MDBCardBody
            className="m-0 p-0 dragDrop"
            style={{
              minHeight: "18rem",
              borderBottom: "1px solid #ccc",
              borderLeft: "1px solid #ccc",
              borderRight: "1px solid #ccc",
            }}
          >
            <MDBListGroup
              style={{
                maxHeight: "18rem",
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
        <Bucket collections={cluster} title="LIS-bound" emoji="⚙️" />
        <Bucket collections={services || []} title={"Pending"} emoji="⏱️" />
      </MDBRow>
    </div>
  );
};

export default Case;
