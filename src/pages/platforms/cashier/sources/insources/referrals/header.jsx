import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  INSOURCE,
  SetREGISTER,
  SetCATEGORY,
  SAVE,
} from "../../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../../components/searchables/sources";
import Swal from "sweetalert2";
import { fullAddress } from "../../../../../../services/utilities";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { category, contractCategories } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
            categories: ["rfr"],
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  const handleRegister = (name = "") => {
    dispatch(SetREGISTER({ name }));
  };

  const setSource = (source) => {
    const { name, displayname = "", _id } = source;
    Swal.fire({
      title: `<strong>${name || "New Referral"}</strong>`,
      html: `
    <p style="margin-bottom: 12px;">Do you want to register this referral with the following details?</p>
    <div style="text-align: left; font-size: 14px; line-height: 1.6; background-color: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid #ddd;">
      <div><strong>Name:</strong> ${name}${
        displayname ? ` – ${displayname}` : ""
      }</div>
      <div><strong>Address:</strong> ${fullAddress(source?.address)}</div>
    </div>
  `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, register it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          SAVE({
            token,
            data: {
              clients: _id,
              status: "approved",
              category: "rfr",
              vendors: activePlatform.branchId,
            },
          })
        ).then(() => {
          Swal.fire({
            icon: "success",
            title: "Successfully Registered",
            text: `${name} has been registered as a new referral.`,
            confirmButtonColor: "#3085d6",
          });
        });
      }
    });
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Insource-Referrals List
        </span>
      </div>

      <Search setSource={setSource} handleRegister={handleRegister} />
    </MDBView>
  );
};

export default Header;
