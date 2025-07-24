import {
  MDBTable,
  MDBTableHead,
  MDBCard,
  MDBCardBody,
  MDBView,
  MDBCol,
  MDBTableBody,
} from "mdbreact";
import { Search } from "../../../../../components/searchables";
import { useEffect, useState } from "react";
import dragAndDrop from "../../../../../assets/drag-and-drop.png";
import { useSelector } from "react-redux";
import EditableField from "../../../../../components/customizable/editableField";

const Bucket = ({
  title,
  collections = [],
  hasSelected = false,
  cluster = [],
  handleDrop = () => {},
  handleDragStart = () => {},
  handleUpdate = () => {},
}) => {
  const { selected } = useSelector(({ machines }) => machines);
  const [services, setServices] = useState([]);
  const [didSearch, setDidSearch] = useState(false);

  useEffect(() => {
    if (collections.length > 0) {
      setServices(collections);
    } else {
      setServices([]);
    }
  }, [collections]);

  const filteredData = !hasSelected
    ? services.filter(
        (item) =>
          ![...cluster, ...selected?.services].some(({ id }) => id === item.id)
      )
    : services;

  const handleDragOver = (e) => e.preventDefault();

  return (
    <MDBCol>
      <MDBCard
        narrow
        onDrop={(e) => handleDrop(e, hasSelected)}
        onDragOver={handleDragOver}
      >
        <MDBView
          cascade
          className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
        >
          <span> {title}</span>
          <Search
            haveAction={false}
            collections={services}
            setFiltered={(results) => {
              setDidSearch(true);
              setServices(results);
            }}
            reset={() => {
              setDidSearch(false);
              setServices(collections);
            }}
          />
        </MDBView>
        <MDBCardBody>
          <div
            style={{
              overflowY: "auto",
              maxHeight: "25rem",
              minHeight: "25rem",
            }}
          >
            <MDBTable small>
              <MDBTableHead>
                <tr>
                  <th>Name</th>
                  <th>{hasSelected ? "Code" : "Abbreviation"}</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, hasSelected)}
                    >
                      <td>{item.name}</td>
                      <td>
                        {hasSelected ? (
                          <EditableField
                            displayTag="span"
                            fieldData={{ ...item }}
                            keyForValue="code"
                            isCapitalize={false}
                            localUpdate={true}
                            width={"15rem"}
                            onSave={(data) => handleUpdate(data, index)}
                          />
                        ) : (
                          item.abbreviation
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      {didSearch ? (
                        "No services found. Try another keywords"
                      ) : (
                        <>
                          {" "}
                          <span
                            className="mt-5 d-block"
                            style={{ fontWeight: 500 }}
                          >
                            Drag and drop services here!
                          </span>
                          <img
                            src={dragAndDrop}
                            alt="No Data"
                            style={{ height: "12rem" }}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Bucket;
