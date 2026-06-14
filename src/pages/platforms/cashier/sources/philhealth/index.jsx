import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import Swal from "sweetalert2";

import TableLoading from "../../../../../components/tableLoading";
import {
  CTBROWSE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/branches";

const philhealthLogo = `${process.env.PUBLIC_URL || ""}/assets/logo/philhealth.png`;

const Index = () => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const {
    ct: branch = {},
    isLoading,
    formSubmitted,
  } = useSelector(({ branches }) => branches);

  const phi = branch?.phi || {};
  const isAccredited = useMemo(() => {
    if (typeof phi?.accredited === "boolean") return phi.accredited;

    const start = phi?.validity?.start ? new Date(phi.validity.start) : null;
    const end = phi?.validity?.end ? new Date(phi.validity.end) : null;
    if (!start || !end) return false;

    const now = new Date();
    return start <= now && end >= now;
  }, [phi]);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        CTBROWSE({
          token,
          data: { _id: activePlatform.branchId },
        }),
      );
    }
  }, [activePlatform?.branchId, dispatch, token]);

  const formatDateInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  };

  const formatDateDisplay = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const handleEdit = () => {
    Swal.fire({
      title: "Edit PhilHealth Accreditation",
      html: `
        <input id="phi-an" class="swal2-input" placeholder="Accreditation number">
        <input id="phi-start" class="swal2-input" type="date" placeholder="Start date">
        <input id="phi-end" class="swal2-input" type="date" placeholder="End date">
        <textarea id="phi-remarks" class="swal2-textarea" placeholder="Remarks"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      focusConfirm: false,
      didOpen: () => {
        document.getElementById("phi-an").value = phi?.an || "";
        document.getElementById("phi-start").value = formatDateInput(
          phi?.validity?.start,
        );
        document.getElementById("phi-end").value = formatDateInput(
          phi?.validity?.end,
        );
        document.getElementById("phi-remarks").value = phi?.remarks || "";
      },
      preConfirm: () => {
        const an = document.getElementById("phi-an")?.value.trim();
        const start = document.getElementById("phi-start")?.value;
        const end = document.getElementById("phi-end")?.value;
        const remarks = document.getElementById("phi-remarks")?.value.trim();

        if (start && end && new Date(start) > new Date(end)) {
          Swal.showValidationMessage(
            "Validity start date must be earlier than end date.",
          );
          return false;
        }

        return {
          an,
          validity: {
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
          },
          remarks,
        };
      },
    }).then(({ isConfirmed, value }) => {
      if (!isConfirmed) return;

      dispatch(
        UPDATE({
          token,
          data: {
            _id: activePlatform.branchId,
            phi: value,
          },
        }),
      );
    });
  };

  return (
    <div style={{ width: "800px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody>
          <MDBView className="text-center">
            <img
              src={philhealthLogo}
              alt="PhilHealth"
              style={{
                width: "220px",
                maxWidth: "100%",
                height: "auto",
                marginBottom: "0.75rem",
              }}
            />
            <h5>
              <b>Accreditation</b>
            </h5>
          </MDBView>
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <div className="d-flex justify-content-center mb-3">
                <span
                  className={`badge px-3 py-2 ${
                    isAccredited ? "badge-success" : "badge-secondary"
                  }`}
                  style={{ fontSize: "0.95rem" }}
                >
                  {isAccredited ? "Accredited" : "Not Accredited"}
                </span>
              </div>

              <div className="px-md-5">
                <h6>
                  <b>Accreditation Number:</b> {phi?.an || "N/A"}
                </h6>
                <h6>
                  <b>Validity Start:</b> {formatDateDisplay(phi?.validity?.start)}
                </h6>
                <h6>
                  <b>Validity End:</b> {formatDateDisplay(phi?.validity?.end)}
                </h6>
                <h6>
                  <b>Remarks:</b> {phi?.remarks || "N/A"}
                </h6>
              </div>

              <div className="text-center mt-4">
                <MDBBtn
                  color="info"
                  disabled={formSubmitted}
                  onClick={handleEdit}
                >
                  <MDBIcon icon="edit" className="mr-1" />
                  Edit PhilHealth
                </MDBBtn>
              </div>
            </>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Index;
