import { useCallback, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdbreact";
import { TOGGLE_CLONE } from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";
import Bucket from "./bucket";
import { capitalize } from "../../../../../../services/utilities";
import { SetCLONE } from "../../../../../../services/redux/slices/commerce/catalog/menus";

export default function CloneModal() {
  const { auth, token, activePlatform } = useSelector(({ auth }) => auth),
    { showCloneModal: show, collections: branches } = useSelector(
      ({ branches }) => branches
    ),
    { clone = {} } = useSelector(({ menus }) => menus),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const mainBranch = branches.find((branch) => branch?.isMain) || {};
      if (mainBranch?._id) {
        const { _id = "", menus = [] } = mainBranch || {};
        dispatch(SetCLONE({ ...clone, by: { _id, collections: menus } }));
      }
    }
  }, [show, branches]);

  const toggle = useCallback(() => dispatch(TOGGLE_CLONE()), [dispatch]);

  return (
    <MDBModal size="xl" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clone" className="mr-2" />
        Clone Product & Services
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow className="mb-2">
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="m-0 p-1 border border-info bg-light">
                <div className="d-flex align-items-center">
                  <h6 className="text-nowrap mt-2 mr-2">Clone By</h6>
                  <select className="form-control form-control-sm">
                    <option value={""}>Select Branch</option>
                    {branches.map((item, index) => (
                      <option key={index} value={item._id}>
                        {capitalize(item.name)} {item.isMain ? "(Main)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="m-0 p-1 border border-info bg-light">
                <div className="d-flex align-items-center">
                  <h6 className="text-nowrap mt-2 mr-2">Clone To</h6>
                  <select className="form-control form-control-sm">
                    <option value={""}>Select Branch</option>
                    {branches.map((item, index) => (
                      <option key={index} value={item._id}>
                        {capitalize(item.name)} {item.isMain ? "(Main)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <Bucket identifier="by" />
          <Bucket identifier="to" />
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
