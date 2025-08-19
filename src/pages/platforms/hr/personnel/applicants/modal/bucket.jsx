import {
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardHeader,
} from "mdbreact";
import "./index.css";
import dragAndDrop from "../../../../../../assets/drag-and-drop.png";
import { capitalize } from "lodash";
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
  const renderListItems = () => {
    return (
      <>
        {collections.map((item, index) => (
          <MDBListGroupItem
            onDragStart={(event) =>
              handleDragStart(event, item, !isTag, tableName)
            }
            onDragOver={handleDragOver}
            className={`${
              hasDrag ? "cursor-grabbing" : "cursor-grab"
            } d-flex align-items-center p-1`}
            draggable
            key={index}
            style={{
              borderRight: "transparent",
              borderLeft: "transparent",
              borderTop: index === 0 && "transparent",
            }}
          >
            <strong className="mr-2">{index + 1}.</strong>{" "}
            {capitalize(item.platform)}
          </MDBListGroupItem>
        ))}
      </>
    );
  };

  const renderEmptyState = () => (
    <MDBListGroupItem
      className={"text-center"}
      style={{
        display: "flex",
        border: "none",
        height: "50vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="d-flex flex-column">
        <p className="text-center">Drag and Drop Access Here...</p>
        <img src={dragAndDrop} alt="No Data" style={{ height: "12rem" }} />
      </div>
    </MDBListGroupItem>
  );

  return (
    <MDBCard className="m-0 p-0" style={{ boxShadow: "0px 0px 0px 0px" }}>
      <MDBCardHeader className="bg-light  d-flex justify-content-between align-items-center">
        <span style={{ fontWeight: 500 }}>{tableName}</span>
        {!isTag && (
          <input
            type="search"
            className="form-control form-control-sm  ml-5"
            style={{ marginBottom: "-1rem", marginTop: "-0.9rem" }}
            value={search}
            placeholder="Search.."
            onChange={({ target }) => handleSearch(target.value)}
          />
        )}
      </MDBCardHeader>
      <MDBCardBody
        className="m-0 p-0"
        style={{
          minHeight: "13rem",
          border: "1px solid #ccc",
        }}
        onDrop={(event) => handleDrop(event, tableName)}
        onDragOver={handleDragOver}
      >
        <MDBListGroup
          style={{
            maxHeight: "13rem",
            overflowY: "auto",
          }}
          className="summary-scrollbar"
        >
          {collections?.length > 0 ? renderListItems() : renderEmptyState()}
        </MDBListGroup>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Table;
