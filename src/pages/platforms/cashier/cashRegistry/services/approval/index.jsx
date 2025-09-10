import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  allServicesHavePrices,
  Cloudinary,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import _, { isEmpty } from "lodash";
import {
  PROCESS_ONBOARDING,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import {
  InitializeCART,
  TOGGLE,
} from "../../../../../../services/redux/slices/commerce/pos/services/kiosk";
import Swal from "sweetalert2";
import Customer from "./customer";
import Menus from "./menus";
import ApprovedSummary from "./summary/approved.jsx";
import PendingSummary from "./summary/pending.jsx";
import { ImageMagnifier } from "../../../../../../components/images";
import utils from "./utils.js";

export default function Approval() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    {
      showModal: show,
      selected,
      cart,
      isAuthorization,
      payment,
      cash,
    } = useSelector(({ kiosk }) => kiosk),
    { collections: menuCollections } = useSelector(({ menus }) => menus),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE(true)), [dispatch]);

  const {
    pid: customerId = {},
    client = {},
    branchId = {},
    haveCard = false,
    services: servicesId = [],
    contract,
    schedule,
    requirements,
  } = selected || {};

  // const { membership = "", servicesId = [], contract } = sendouts;

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, show, toggle, dispatch]);

  useEffect(() => {
    if (show) {
      dispatch(InitializeCART(menuCollections));
    }
  }, [show, menuCollections, dispatch]);

  const getCategory = () => {
    if (client?._id) return "ctr";
    return haveCard ? "wls" : "opd";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { discount, gross } = utils.computeCharges(cart, selected);

    const remainingPackages = [...servicesId].filter(
      (serviceID) => !cart.some((item) => item.packages.includes(serviceID))
    );

    const filteredCart = cart.filter(
      (item) => !item.packages.some((pkg) => remainingPackages.includes(pkg))
    );

    const dealMenus = filteredCart.map((cart) => {
      return {
        // ...computeGD(cart, -1, -1, "", customerId?.healthCard?.name, contract),
        menuId: cart._id,
      };
    });

    const deal = {
      source: branchId?._id,
      branchId: activePlatform.branchId,
      customerId: customerId._id,
      cash,
      category: getCategory(),
      cashierId: auth._id,
      payment: getCategory() === "opd" ? payment : "voucher",
      department: Services.getDepartment(
        filteredCart.flatMap(({ packages }) => packages)
      ),
      discount,
      amount: gross,
    };

    const data = {
      deal,
      dealMenus,
      onboardingID: selected?._id,
      empId: auth._id,
      status: "done",
    };

    if (!isEmpty(remainingPackages)) {
      return Swal.fire({
        icon: "warning",
        title: "Partial Acknowledgement",
        html: `
      <div style="text-align: left; font-size: 15px;">
        <p>The request from <b>${
          getCategory() === "ctr"
            ? client.displayname
            : fullName(customerId?.fullName)
        }</b> has been
          <span style="color: #e67e22;"><b>partially acknowledged</b></span>.
        </p>
        <p>The following services could not be accommodated:</p>
        <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 1em;">
          ${remainingPackages
            .map((id) => `<li>${Services.getAbbr(id)}</li>`)
            .join("")}
        </ul>
        <p style="margin-top: 1em;"><i>Please provide your reason for the incomplete processing:</i></p>
      </div>`,
        input: "textarea",
        inputPlaceholder: "Enter your remarks here...",
        inputAttributes: {
          "aria-label": "Remarks",
        },
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        preConfirm: (remarks) => {
          if (!remarks) {
            Swal.showValidationMessage("Please provide a remarks.");
          }
          return remarks;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const remarks = result.value;
          dispatch(
            PROCESS_ONBOARDING({
              data: {
                ...data,
                remarks,
                cancelled: remainingPackages,
              },
              token,
            })
          );
        }
      });
    }

    if (
      !allServicesHavePrices(cart, 0, customerId?.healthCard?.name, contract)
    ) {
      Swal.fire({
        title: "Service Validator?",
        text: "Some services do not have a set price. Please double-check. If you're confident everything is correct, you may proceed. Note that the admin will be notified regarding this issue.",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(PROCESS_ONBOARDING({ data, token }));
        }
      });
    } else {
      return dispatch(PROCESS_ONBOARDING({ data, token }));
    }
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="fluid">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(customerId.fullName)} | {getAge(customerId.dob)}
        <br />
        <small
          style={{
            marginBottom: "-15px",
            marginTop: "-4px",
            display: "block",
            fontWeight: "300",
            marginLeft: "2rem",
            fontSize: "1rem",
          }}
        >
          {fullAddress(customerId.address)}
        </small>
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          {isAuthorization ? (
            <MDBCol>
              <div className="shadow-sm">
                <ImageMagnifier
                  src={`${Cloudinary.getEndpoint()}/${
                    requirements?.rfId || ""
                  }/users/${customerId.email}/booking/form-${schedule}.png`}
                />
              </div>
            </MDBCol>
          ) : (
            <Customer />
          )}
          <Menus contract={contract} />
          {isAuthorization ? (
            <PendingSummary handleSubmit={handleSubmit} />
          ) : (
            <ApprovedSummary handleSubmit={handleSubmit} />
          )}
        </MDBRow>
      </MDBModalBody>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // background: "#f1c40f",
          padding: ".5rem",
          borderRadius: ".5rem",
          margin: ".5rem 0",
          color: "#f1c40f",
        }}
      >
        Autogenerated POS by
        <span style={{ color: "#2c3e50", marginLeft: "10px" }}> Pinoy iMD</span>
      </div>
    </MDBModal>
  );
}
