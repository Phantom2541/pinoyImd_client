import { useState } from "react";
import Header from "./header";
import Body from "./body";
import Modal from "./modal";
import Swal from "sweetalert2";
import { capitalize, fullName } from "../../../../../../services/utilities";

const Collapse = ({ branch = {} }) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});
  const handleTag = (user, isRegister = false) => {
    const { affiliated = [] } = branch;
    const isExist = affiliated.some((a) => a?.user?._id === user?._id);
    if (isExist) {
      return Swal.fire({
        icon: "info",
        title: "Already Tagged",
        html: `
    <div style="text-align:center; line-height:1.6; padding: 5px 10px;">
      <p style="font-size:1rem; margin:0;">
        <span style="display:inline-block;font-weight:700;color:#1266f1;font-size:1.05rem;">
          ${fullName(user?.fullName)}
        </span>
      </p>
      <p style="margin:6px 0 0 0; font-size:.95rem; color:#495057;">
        is already tagged to
      </p>
      <p style="margin:6px 0 10px 0;">
        <span style="display:inline-block;font-weight:700;color:#d63384;font-size:1rem;">
          ${capitalize(branch?.name || branch?.displayname)}
        </span>
      </p>
      <hr style="margin:10px auto;width:70%;border:none;border-top:1px solid #dee2e6;">
      <p style="margin-top:8px;font-size:.9rem;color:#6c757d;">
        You can update the existing record or select a different physician.
      </p>
    </div>
  `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#1266f1",
        width: 420,
      });
    }
    setSelected(isRegister ? { fullName: user, isRegister } : user);
    setShow(true);
  };
  return (
    <>
      <Header
        handleTag={handleTag}
        hasAffiliated={branch?.affiliated?.length > 0}
        affiliated={branch?.affiliated?.length}
      />
      <Body branch={branch} />
      <Modal
        show={show}
        toggle={() => setShow(!show)}
        selected={selected}
        branch={branch}
      />
    </>
  );
};

export default Collapse;
