import { MDBBtn, MDBIcon } from "mdbreact";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { gDrive } from "../../../../../../../../../services/utilities";
import Swal from "sweetalert2";

const Images = () => {
  const { task } = useSelector(({ validator }) => validator);
  const [link, setLink] = useState(""),
    dispatch = useDispatch();
  const handleOpenLink = () => {
    const { fileId, isValid, isSharedToAnyone } = gDrive.extractFileId(link);

    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Google Drive Link",
        text: "Please enter a valid Google Drive link.\ne.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!isSharedToAnyone) {
      Swal.fire({
        icon: "warning",
        title: "Restricted File",
        html: `This file doesn't appear to be shared with everyone.<br><br>
             Please ensure the file's sharing settings are set to <b>"Anyone with the link"</b> so it can be displayed properly.`,
        confirmButtonText: "Okay",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    dispatch(
      SetTASK({
        task: { ...task, fileId },
        form: task.form,
      })
    );

    Swal.fire({
      icon: "success",
      title: "Image Loaded Successfully",
      text: "The file from your link has been added.",
      timer: 1500,
      showConfirmButton: false,
    });
  };
  return (
    <div className="mt-3 position-relative">
      <div className="d-flex align-items-center mb-2">
        <select className="form-control mr-2">
          <option>Technician</option>
        </select>
        <select className="form-control">
          <option>Technician</option>
        </select>
      </div>
      {!task?.fileId ? (
        <div className="d-flex align-items-center mt-3">
          <input
            value={link}
            onChange={({ target }) => setLink(target.value)}
            className="form-control "
            style={{ width: "87%" }}
            placeholder="Paste Google Drive Link e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
          />
          <MDBBtn size="sm" color="primary" onClick={handleOpenLink}>
            Open
          </MDBBtn>
        </div>
      ) : (
        <div className="position-relative">
          <MDBBtn
            size="sm"
            color="danger"
            rounded
            title="Change image"
            onClick={() =>
              dispatch(
                SetTASK({
                  task: { ...task, fileId: "" },
                  form: task.form,
                })
              )
            }
            style={{ top: 0, right: "5px" }}
            className="position-absolute px-2 py-1"
          >
            <MDBIcon icon="times" />
          </MDBBtn>

          {/* Container with maxHeight and scroll */}
          <div style={{ maxHeight: "16rem", overflow: "auto" }}>
            <img
              alt="Ecg"
              src={gDrive.view(task.fileId)}
              className="w-100 rounded shadow-sm"
              style={{ display: "block" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;
