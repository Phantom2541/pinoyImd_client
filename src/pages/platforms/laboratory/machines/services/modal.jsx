import { useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE_SERVICES } from "../../../../../services/redux/slices/market/machines";
import { SAVE } from "../../../../../services/indexDB/commerce/market/machines";
import Bucket from "./bucket";
import Swal from "sweetalert2";
import { capitalize } from "../../../../../services/utilities";
export default function ServicesModal() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { showServices: show, selected } = useSelector(({ machines }) => machines),
    [cluster, setCluster] = useState([]),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_SERVICES());

  const handlePick = async (service) => {
    const { value: code } = await Swal.fire({
      title: `Set a code for "${service.name}"`,
      input: "text",
      inputLabel: "Service Code",
      inputPlaceholder: "Enter a code for this service",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a code!";
        }
        return null;
      },
    });

    if (code) {
      const _cluster = [...cluster];
      const index = _cluster.findIndex((s) => s.id === service.id);

      if (index > -1) {
        _cluster.splice(index, 1);
      } else {
        _cluster.unshift({ ...service, code }); // attach the code
      }
      setCluster(_cluster);
    }
  };

  const handleDragStart = (e, item, hasSelected) => {
    // Create custom drag image
    const dragGhost = document.createElement("div");
    dragGhost.innerHTML = item.name;
    dragGhost.style.position = "absolute";
    dragGhost.style.top = "-1000px";
    dragGhost.style.left = "-1000px";
    dragGhost.style.padding = "8px 12px";
    dragGhost.style.background = "white";
    dragGhost.style.border = "1px solid #ccc";
    dragGhost.style.boxShadow = "2px 4px 10px rgba(0,0,0,0.2)";
    dragGhost.style.transform = "rotate(-5deg)";
    dragGhost.style.fontSize = "14px";
    dragGhost.style.fontWeight = "bold";
    dragGhost.style.opacity = "0.9";
    dragGhost.style.borderRadius = "6px";
    dragGhost.style.fontFamily = "serif";
    dragGhost.style.whiteSpace = "nowrap";

    document.body.appendChild(dragGhost);

    // Set as drag image
    e.dataTransfer.setDragImage(dragGhost, 0, 0);

    // Optional: send data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ item, hasSelected })
    );
  };

  const handleDrop = async (e, _hasSelected) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const { item, hasSelected } = JSON.parse(data);

    if (_hasSelected === hasSelected) return;
    const _cluster = [...cluster];
    const index = _cluster.findIndex((s) => s.id === item.id);
    if (_hasSelected) {
      if (index > -1) {
        _cluster.splice(index, 1);
      } else {
        const { value: code } = await Swal.fire({
          html: `
    <div style="text-align: center;">
      <div style="font-size: 18px; color: #555;">Set a code for</div>
      <div style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">
        ${capitalize(item.name)}
      </div>
      <input id="service-code" class="form-control" placeholder="Enter a code" />
    </div>
  `,
          showCancelButton: true,
          confirmButtonText: "Save",
          cancelButtonText: "Cancel",
          focusConfirm: false,
          preConfirm: () => {
            const code = document.getElementById("service-code").value.trim();
            if (!code) {
              Swal.showValidationMessage("Please enter a code!");
            }
            return code;
          },
        });
        if (code) {
          _cluster.unshift({ ...item, code });
        }
      }
    } else {
      _cluster.splice(index, 1);
    }
    setCluster(_cluster);
    document.getElementById("item-search").value = "testing lang";
  };
  return (
    <MDBModal size="xl" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="flask" className="mr-2" />
        Add a Service
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <Bucket
            title={"Available Services"}
            collections={Services.filterByStrTemplate(
              activePlatform.department,
              selected.section
            )}
            cluster={cluster}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
          />
          <Bucket
            title={"Selected Services"}
            collections={cluster}
            hasSelected
            handlePick={handlePick}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
          />
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
