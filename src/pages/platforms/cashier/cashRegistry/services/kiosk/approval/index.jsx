import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import {
  allServicesHavePrices,
  computeGD,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../../services/utilities/index.js";
import { Services } from "../../../../../../../services/fakeDb/index.js";
import _, { isEmpty } from "lodash";
import {
  PROCESS_ONBOARDING,
  RESET as RESET_ONBOARDING,
  UPDATE,
} from "../../../../../../../services/redux/slices/commerce/pos/services/onBoardings.js";
import {
  InitializeCART,
  TOGGLE,
  SetREFNO,
  SetPAYMENT,
  RESET as RESET_KIOSK,
  ResetREFNO,
  SetCASH,
} from "../../../../../../../services/redux/slices/commerce/pos/services/kiosk.js";
import Menus from "./menus/index.jsx";
import PendingSummary from "./summary/pending.jsx";
import utils from "./utils.js";
import ProfileSwitcher from "./profileSwitcher/index.jsx";
import Footer from "./footer.jsx";
import Swal from "sweetalert2";

export default function Approval() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    {
      showModal: show,
      selected,
      cart,
      isAuthorization,
      payment,
      cash,
      refNo,
      isSendOut = false,
    } = useSelector(({ kiosk }) => kiosk),
    { collections: menuCollections } = useSelector(({ menus }) => menus),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE());

  const {
    pid: customerId = {},
    haveCard = false,
    isWalkin = false,
    contract,
    refNo: _refNo,
    payment: _payment,
    services,
    cash: _cash,
    client = {},
    branchId = {},
    requirements = {},
  } = selected || {};

  useEffect(() => {
    if (show) {
      dispatch(InitializeCART(menuCollections));
      dispatch(SetREFNO(_refNo));
      dispatch(SetPAYMENT(_payment));
      dispatch(SetCASH(_cash));
    }
  }, [show, menuCollections, dispatch, _refNo, _payment]);

  useEffect(() => {
    if (!isSendOut && cart.length > 0 && haveCard) {
      //para kapag walang need icashout automatic mag vovoucher yung payment
      const hasCashOut = Boolean(utils.compute.cashOut(cart, selected));
      if (!hasCashOut) {
        dispatch(SetPAYMENT("voucher"));
        dispatch(ResetREFNO());
      }
    }
  }, [cart, selected, dispatch, haveCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const _refNo = utils.refNo.process(cart, refNo, selected);
    const hasRefno = payment === "mixed" || payment === "voucher";
    const hasCash =
      payment === "cash" || (payment === "mixed" && _refNo?.pp === "cash");
    const { discount, gross } = utils.compute.charges(cart, selected);
    //
    if (!utils.refNoIsValid(refNo)) return;
    if (!utils.checkOutChecker(cart, selected, payment)) return;
    const remainingPackages = [...services].filter(
      (serviceID) => !cart.some((item) => item.packages.includes(serviceID))
    );

    const filteredCart = cart.filter(
      (item) => !item.packages.some((pkg) => remainingPackages.includes(pkg))
    );

    const dealMenus = filteredCart.map((cart) => {
      return {
        ...computeGD(cart, 0, -1, {
          type: haveCard ? "wls" : "wi",
          company: { name: haveCard ? selected?.requirements?.hmo : "" },
        }),
        menuId: cart._id,
      };
    });

    const deal = {
      source: branchId?._id,
      branchId: activePlatform.branchId,
      customerId: customerId._id,
      cash: hasCash ? cash : 0,
      category: "wi",
      cashierId: auth._id,
      payment,
      department: Services.getDepartment(
        filteredCart.flatMap(({ packages }) => packages)
      ),
      discount,
      amount: gross,
      ...(_refNo && hasRefno && { refNo: _refNo }),
      ...(haveCard && {
        cardHolder: { type: "wls", company: { name: requirements?.hmo } },
      }),
    };

    const { covered, notCovered } = utils.arrangeServices(cart, selected);

    const data = {
      deal,
      dealMenus,
      onboardingID: selected?._id,
      empId: auth._id,
      status: "done",
      services: covered,
      notCovered,
      ...(_refNo && hasRefno && { refNo: _refNo }),
    };

    if (!utils.priceChecker(cart, selected, isSendOut)) return;

    dispatch(PROCESS_ONBOARDING({ data, token })).then(() => {
      dispatch(RESET_KIOSK());
      dispatch(RESET_ONBOARDING());
      dispatch(TOGGLE());
    });

    // if (!isEmpty(remainingPackages) && isSendOut) {
    //   return Swal.fire({
    //     icon: "warning",
    //     title: "Partial Acknowledgement",
    //     html: `
    //   <div style="text-align: left; font-size: 15px;">
    //     <p>The request from <b>${
    //       isSendOut ? client.displayname : fullName(customerId?.fullName)
    //     }</b> has been
    //       <span style="color: #e67e22;"><b>partially acknowledged</b></span>.
    //     </p>
    //     <p>The following services could not be accommodated:</p>
    //     <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 1em;">
    //       ${remainingPackages
    //         .map((id) => `<li>${Services.getAbbr(id)}</li>`)
    //         .join("")}
    //     </ul>
    //     <p style="margin-top: 1em;"><i>Please provide your reason for the incomplete processing:</i></p>
    //   </div>`,
    //     input: "textarea",
    //     inputPlaceholder: "Enter your remarks here...",
    //     inputAttributes: {
    //       "aria-label": "Remarks",
    //     },
    //     showCancelButton: true,
    //     reverseButtons: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Submit",
    //     cancelButtonText: "Cancel",
    //     preConfirm: (remarks) => {
    //       if (!remarks) {
    //         Swal.showValidationMessage("Please provide a remarks.");
    //       }
    //       return remarks;
    //     },
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       const remarks = result.value;
    //       dispatch(
    //         PROCESS_ONBOARDING({
    //           data: {
    //             ...data,
    //             remarks,
    //             cancelled: remainingPackages,
    //           },
    //           token,
    //         })
    //       );
    //     }
    //   });
    // }

    // if (
    //   !allServicesHavePrices(cart, 0, customerId?.healthCard?.name, contract)
    // ) {
    //   Swal.fire({
    //     title: "Service Validator?",
    //     text: "Some services do not have a set price. Please double-check. If you're confident everything is correct, you may proceed. Note that the admin will be notified regarding this issue.",
    //     icon: "error",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Yes, proceed",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       dispatch(PROCESS_ONBOARDING({ data, token }));
    //     }
    //   });
    // } else {
    //   return dispatch(PROCESS_ONBOARDING({ data, token }));
    // }
  };

  const handleApprove = (e) => {
    e.preventDefault();
    const _refNo = utils.refNo.process(cart, refNo, selected);
    const { covered, notCovered } = utils.arrangeServices(cart, selected);
    const hasRefno = payment === "mixed" || payment === "voucher";
    if (!utils.refNoIsValid(refNo)) return;
    console.log("cart", cart);
    console.log("covered", covered, "notCovered", notCovered);
    dispatch(
      UPDATE({
        token,
        data: {
          ...selected,
          services: covered,
          payment,
          cash,
          status: "approved",
          isRemoved: isAuthorization,
          verifiedBy: {
            verifiedAt: new Date().toLocaleDateString(),
            eid: auth._id,
          },
          ...(_refNo && hasRefno && { refNo: _refNo }),
          notCovered,
        },
      })
    ).then(() => {
      dispatch(RESET_KIOSK());
      dispatch(RESET_ONBOARDING());
      dispatch(TOGGLE());
    });
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      size={!isWalkin ? "fluid" : "xl"}
    >
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
          <ProfileSwitcher />
          <Menus contract={contract} />
          <PendingSummary
            handleSubmit={isAuthorization ? handleApprove : handleSubmit}
            handleApprove={handleApprove}
          />
        </MDBRow>
      </MDBModalBody>
      <Footer />
    </MDBModal>
  );
}
