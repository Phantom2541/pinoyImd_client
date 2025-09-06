import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBBadge,
} from "mdbreact";
import { useSelector } from "react-redux";
import Platforms from "./platforms";
import Profile from "./profile";
import Branches from "./branches";
import { capitalize, employment, fetchTracker } from "../../services/utilities";
import DTR from "./dtr";
import Swal from "sweetalert2";
import indexDB from "../../services/indexDB";

export default function TopNavigation({ toggle, onSideNavToggleClick }) {
  const { activePlatform, auth } = useSelector((state) => state.auth);
  const aka = auth?.alias || auth?.fullName?.fname;

  const navStyle = {
    paddingLeft: toggle ? "16px" : "240px",
    transition: "padding-left .3s",
  };
  const isEmployed = employment.isEmployed(activePlatform?.branch?.status);

  const handleResync = async () => {
    const result = await Swal.fire({
      title: `<strong style="color:#d33;">⚠️ ReSync Data ⚠️</strong>`,
      html: `
    Are you sure you want to <strong style="color:#d33;">ReSync</strong> the data?<br><br>
    Only use this if you notice that some data is <strong style="color:#d33;">incorrect</strong> or <strong style="color:#d33;">not up-to-date</strong>.<br><br>
    <em style="color:#555;">This feature is rarely needed and should be used only when necessary.<br>
    After ReSync, the page will automatically <strong>refresh</strong>.</em>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "<strong style='color:white;'>Yes, ReSync</strong>",
      cancelButtonText: "<strong>No, Cancel</strong>",
      reverseButtons: true,
      focusConfirm: false,
      customClass: {
        confirmButton: "swal2-confirm-danger", // custom class para sa red button
        cancelButton: "swal2-cancel-safe",
      },
    });

    if (result.isConfirmed) {
      // Show loading modal
      Swal.fire({
        title: "ReSyncing Data...",
        html: "Please wait while your data is being updated...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        fetchTracker.reset();

        // Clear all IndexedDB in parallel
        await indexDB.clearAll();

        // Optional: small delay so user sees the "loading"
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Close loading modal
        Swal.close();

        // Show success message
        Swal.fire({
          title: "ReSync Complete ✅",
          html: "Data has been updated. The page will refresh shortly.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          title: "Oops ❌",
          text: "There was a problem updating the data.",
          icon: "error",
        });
      }
    }
  };

  return (
    <MDBNavbar
      className="flexible-MDBNavbar"
      light
      expand="md"
      scrolling
      fixed="top"
      style={{ zIndex: 999 }}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <div
          onClick={onSideNavToggleClick}
          style={{
            lineHeight: "32px",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        >
          <MDBIcon icon="bars" color="white" size="lg" />
        </div>

        <MDBNavbarBrand href="#" style={navStyle}>
          <MDBBadge
            className="py-2 px-3"
            color="warning-color-dark"
            style={{
              fontSize: "1rem",
              fontWeight: 400,
              boxShadow: "0px 0px 0px 0px",
            }}
          >
            {activePlatform?.access?.length > 0 && isEmployed
              ? `${capitalize(activePlatform?.department)} :)`
              : `Welcome to Pinoy iMD :) `}
            {capitalize(aka)}
          </MDBBadge>
        </MDBNavbarBrand>
        <MDBNavbarNav
          expand="sm"
          right
          style={{
            flexDirection: "row",
            gap: "5px",
          }}
        >
          {activePlatform?.access?.length > 0 && isEmployed && (
            <>
              <div
                className="mt-2 cursor-pointer mr-3"
                onClick={() => handleResync()}
              >
                <MDBIcon icon="sync-alt" className="text-danger" />
                <span
                  className="ml-2"
                  title="Use this only if you notice that some data is incorrect or not up-to-date."
                >
                  ReSync Data
                </span>
              </div>
              <DTR />
            </>
          )}
          <Branches />
          <Platforms />
          <Profile />
        </MDBNavbarNav>
      </div>
    </MDBNavbar>
  );
}
