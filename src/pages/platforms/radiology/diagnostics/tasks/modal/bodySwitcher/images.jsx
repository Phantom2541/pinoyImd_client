import { MDBBtn, MDBIcon, MDBTabPane } from "mdbreact";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { fullName, gDrive } from "../../../../../../../services/utilities";
import Swal from "sweetalert2";
import EditableSelect from "../../../../../../../components/customizable/editableSelect";

const Images = () => {
  const { task, heads } = useSelector(({ validator }) => validator);
  const { auth } = useSelector(({ auth }) => auth);
  const { collections: physicians } = useSelector(
    ({ physicians }) => physicians
  );
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

  const [head = "", dr = "", encoder = auth?._id] = task?.signatories || [];

  const handleChange = (value, isTechnician = true) => {
    const updatedTask = {
      ...task,
      signatories: [
        isTechnician ? value : head?._id || head || null,
        !isTechnician ? value : dr?._id || dr || null,
        encoder,
      ],
    };
    console.log("updatedTask", updatedTask, value);
    dispatch(
      SetTASK({
        task: updatedTask,
        form: task.form,
      })
    );
  };
  return (
    <MDBTabPane tabId="images">
      <div className="mt-5">
        <div className="d-flex  mb-2 w-100 mt-3">
          <div className="w-100 text-left mr-3">
            <EditableSelect
              className="w-100"
              parentClassName="w-100"
              collections={heads
                .filter(
                  ({ section }) =>
                    section.toLowerCase() === task?.form.toLowerCase()
                )
                .map(({ user }) => ({
                  fullName: fullName(user.fullName),
                  _id: user._id,
                }))}
              keyForText="fullName"
              keyForValue="_id"
              label="Technician"
              onChange={(value) => handleChange(value)}
            />
          </div>
          <div className="text-left w-100 ml-3">
            <EditableSelect
              collections={physicians
                .filter(
                  ({ specialization }) => specialization === "Radiologist"
                )
                .map(({ user }) => ({
                  fullName: fullName(user.fullName),
                  _id: user._id,
                }))}
              keyForText="fullName"
              parentClassName="w-100"
              keyForValue="_id"
              label=" Sonologist/Radiologist:"
              onChange={(value) => handleChange(value, false)}
            />
          </div>
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
              onClick={() => {
                setLink("");
                dispatch(
                  SetTASK({
                    task: { ...task, fileId: "" },
                    form: task.form,
                  })
                );
              }}
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
    </MDBTabPane>
  );
};

export default Images;
