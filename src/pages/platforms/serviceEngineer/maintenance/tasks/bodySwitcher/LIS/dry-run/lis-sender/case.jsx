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
import dragAndDrop from "../../../../../../../../../assets/drag-and-drop.png";
import { Services } from "../../../../../../../../../services/fakeDb";
import { BROWSE } from "../../../../../../../../../services/indexDB/commerce/market/machines";

const Case = ({ cluster, form, setCluster = () => {}, setForm = () => {} }) => {
  const { work, showWorkArea: show } = useSelector(
      ({ validator }) => validator
    ),
    { collections: machines } = useSelector(({ machines }) => machines),
    [services, setServices] = useState([]),
    [serviceWithoutCode, setServicesWithoutCode] = useState([]);

  const { task = {}, section } = work || {};

  const filteredMachines = machines.filter(
    (machine) => machine.section.toLowerCase() === section.toLowerCase()
  );

  useEffect(() => {
    setCluster([]);
    setServices([]);
    async function fetchIndexDB() {
      const dbServices = await BROWSE(form.machine);
      const { packages } = task || {};
      const _services = Array.isArray(packages)
        ? packages
        : typeof packages === "object"
        ? Object.keys(packages)
        : [packages];

      const servicesWithCode = _services.filter((id) =>
        dbServices.some((code) => Number(id) === Number(code.id))
      );

      const _servicesWithoutCode = _services.filter(
        (id) => !servicesWithCode.includes(id)
      );
      console.log("serviceWithoutCode", serviceWithoutCode);

      setServicesWithoutCode(_servicesWithoutCode);
      setCluster(servicesWithCode);
      setServices(_servicesWithoutCode);
    }
    if (show) {
      fetchIndexDB();
    }
  }, [show, task, setCluster, form.machine, serviceWithoutCode]);

  const handleDragStart = (e, item, fromList) => {
    const dragPreview = document.createElement("div");
    // if (serviceWithoutCode.includes(item)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: Services.find(item)?.name,
    //     html: `
    //   This service cannot be sent to LIS because no code has been assigned to it yet.<br/><br/>
    //   Please go to the <strong>Configure</strong> tab and set a code for this service before proceeding.
    // `,
    //     confirmButtonText: "Got it",
    //   });
    //   return;
    // }
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
  const Bucket = ({ collections, title, emoji, lisBound = false }) => {
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
          <p className="text-center">
            {lisBound
              ? !form.machine
                ? "Please select a machine before proceeding."
                : filteredMachines.length === 0
                ? `No LIS machine found for the ${section} section. Please create one first.`
                : "Drag and drop services here."
              : "Drag and drop services here."}
          </p>
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
          <MDBCardHeader className="bg-light dragDrop d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center w-100">
              {emoji}
              {lisBound && (
                <select
                  className="form-control form-control-sm mr-2 m-0 mb-n1 mt-n1 "
                  style={{ width: "13rem", color: "blue" }}
                  value={form?.machine || ""}
                  onChange={({ target }) =>
                    setForm({ ...form, machine: target.value })
                  }
                  // required
                >
                  <option value="">Select a machine</option>
                  {filteredMachines.map((machine) => (
                    <option key={machine._id} value={machine._id}>
                      {machine.model}
                    </option>
                  ))}
                </select>
              )}
              <span style={{ fontWeight: 500 }}>{title}</span>
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
        <Bucket collections={cluster} title="LIS-bound" emoji="⚙️" lisBound />
        <Bucket collections={services || []} title={"Pending"} emoji="⏱️" />
      </MDBRow>
    </div>
  );
};

export default Case;
