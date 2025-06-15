import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdbreact";
import { TogglePrice } from "../../../../../services/redux/slices/assets/providers";

import { BROWSE } from "../../../../../services/redux/slices/commerce/catalog/menus";

export default function Modal() {
  const { token } = useSelector(({ auth }) => auth),
    { showPriceModal, selected } = useSelector(({ providers }) => providers),
    { collections } = useSelector(({ menus }) => menus),
    dispatch = useDispatch();

  //Listener
  useEffect(() => {
    if (showPriceModal) {
      dispatch(BROWSE({ token, key: { branchId: selected?.vendors._id } }));
    }
  }, [showPriceModal, selected, token, dispatch]);

  //   useEffect(() => {
  //     if (showPriceModal) {
  //       dispatch(TogglePrice());
  //     }
  //   }, [dispatch, showPriceModal]);

  return (
    <MDBModal
      isOpen={showPriceModal}
      toggle={TogglePrice}
      backdrop
      size="md"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={() => dispatch(TogglePrice())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Price List
      </MDBModalHeader>
      <MDBModalBody className="mb-0"></MDBModalBody>
    </MDBModal>
  );
}
