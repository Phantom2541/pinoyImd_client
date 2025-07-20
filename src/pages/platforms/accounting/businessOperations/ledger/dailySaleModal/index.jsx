import React, { useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSpinner,
} from "mdbreact";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/sales";
import {
  OUTSOURCE as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import Card from "../../../../frontdesk/transactions/task/card";

export default function DailySaleModal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { search, pathname } = useLocation(),
    { collections: sales, isLoading } = useSelector(({ sales }) => sales),
    dispatch = useDispatch(),
    history = useHistory(),
    queryParams = new URLSearchParams(search),
    show = Boolean(Number(queryParams.get("dailyFilter"))),
    startDate = queryParams.get("startDate"),
    endDate = queryParams.get("endDate"),
    modalTitle = queryParams.get("modalTitle");

  useEffect(() => {
    if (show && activePlatform?.branchId && auth._id && token) {
      const key = {
        branchId: activePlatform?.branchId,
        createdAt: startDate,
        endDate,
      };

      dispatch(
        BROWSE({
          key,
          token,
        })
      );
      dispatch(
        SOURCELIST({ token, key: { clients: activePlatform?.branchId } })
      );
      dispatch(
        PHYSICIANS({ key: { branch: activePlatform?.branchId }, token })
      );

      return () => {
        dispatch(RESET());
        dispatch(SOURCERESET());
        dispatch(PHYSICIANRESET());
      };
    }
  }, [show, startDate, endDate, token, activePlatform, auth, dispatch]);

  const toggle = () => history.push(pathname);

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="fluid"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        {modalTitle}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {isLoading ? (
          <div className="d-flex justify-content-between my-5">
            <MDBSpinner className="mx-auto" />
          </div>
        ) : (
          <div className="sales-card-wrapper">
            {sales?.map((sale) => (
              <Card
                key={`sale-${sale._id}`}
                sale={sale}
                number={sale.page}
                ledgerView
                isDeleted={Boolean(sale.deletedAt)}
                remarks={sale.remarks}
              />
            ))}
          </div>
        )}
      </MDBModalBody>
    </MDBModal>
  );
}
