import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdbreact";

import { Services } from "../../../../../../../../../../../services/fakeDb";
import { findIndex } from "lodash";
import {
  TOGGLE,
  UPDATE,
  RESET,
} from "../../../../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import Swal from "sweetalert2";
import Menus from "./menus";
import {
  Cloudinary,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../../../../../../services/utilities";
import { ImageMagnifier } from "../../../../../../../../../../../components/images";
import Spinner from "../../../../../../../../../../../components/spinner";
import { useToasts } from "react-toast-notifications";

export default function Translate() {
  const { token } = useSelector(({ auth }) => auth),
    {
      formSubmitted,
      isSuccess,
      showModal: show,
      selected,
    } = useSelector(({ onBoardings }) => onBoardings),
    { collections: menus } = useSelector(({ menus }) => menus),
    [cart, setCart] = useState([]),
    [matchMenus, setMatchMenus] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE(false)), [dispatch]);

  const { pid = {}, schedule, requirements = {} } = selected || {};

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      addToast("Successfully Translated!.", {
        appearance: "success",
      });
      toggle();
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, show, toggle, dispatch, addToast]);

  useEffect(() => {
    if (show) {
      setCart([]);
      const { services: servicesId = [] } = selected;
      const _matchMenus = [...menus].filter(
        ({ isProfile = false, packages = [] }) =>
          !isProfile && packages.length === 1
      );

      if (servicesId.length > 0) {
        const defaultMenus = [];
        for (const menu of _matchMenus) {
          const { packages, isProfile = false } = menu;
          const isSubset =
            packages.length === 1 &&
            packages.every((id) => servicesId.includes(id));
          if (isSubset && !isProfile) {
            defaultMenus.push(menu);
            if (defaultMenus.length === servicesId.length) break;
          }
        }

        setCart(defaultMenus);
      }

      setMatchMenus(_matchMenus);
    }
  }, [show, menus, selected]);

  const handleRemovedToCart = (_id) => {
    const _cart = [...cart];
    const index = findIndex(_cart, { _id });
    _cart.splice(index, 1);
    setCart(_cart);
  };

  const handleAddToCart = (menu) => {
    const { packages } = menu;
    const _cart = [...cart];
    const index = findIndex(_cart, { _id: menu._id });
    const duplicatePackages = _cart.some((item) =>
      menu.packages.some((id) => item.packages.includes(id))
    );

    if (duplicatePackages) {
      return Swal.fire({
        icon: "warning",
        title: "Duplicate Packages",
        html: `This    <b>${packages
          .map((id) => Services.getAbbr(id))
          .join(", ")}</b> package  has already been selected.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
    if (index > -1) return "";
    _cart.unshift(menu);
    setCart(_cart);
  };
  const handleSubmit = () => {
    const services = cart.flatMap(({ packages }) => packages);
    dispatch(
      UPDATE({
        token,
        data: { ...selected, services, pid: pid?._id },
      })
    );
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(pid.fullName)} | {getAge(pid.dob)}
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
          {fullAddress(pid.address)}
        </small>
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <Menus
            cart={cart}
            matchMenus={matchMenus}
            handleAddToCart={handleAddToCart}
            handleRemovedToCart={handleRemovedToCart}
          />
          <MDBCol>
            <div className="shadow-sm">
              <ImageMagnifier
                src={`${Cloudinary.getEndpoint()}/${
                  requirements?.rfId || ""
                }/users/${pid.email}/booking/form-${schedule}.png`}
              />
            </div>
          </MDBCol>
        </MDBRow>
        <div className="text-center mt-3">
          <MDBBtn
            rounded
            color="info"
            onClick={handleSubmit}
            disabled={formSubmitted || cart.length === 0}
          >
            Submit <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
