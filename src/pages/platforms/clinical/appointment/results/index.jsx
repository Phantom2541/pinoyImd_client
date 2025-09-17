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
import {
  TOGGLE_RESULT_MODAL,
  SetDIAGNOSTIC,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import {
  Cloudinary,
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../../services/utilities";
import Records from "./records";
import Images from "./images";
import Swal from "sweetalert2";
import {
  DESTROY_IMG,
  UPLOAD,
} from "../../../../../services/redux/slices/assets/persons/auth";
import Spinner from "../../../../../components/spinner";
import { useEffect, useState } from "react";

export default function ResultsModal() {
  const { token } = useSelector(({ auth }) => auth),
    {
      showResultModal: show,
      selected,
      diagnostic,
    } = useSelector(({ appointments }) => appointments),
    { collections: results, isLoading } = useSelector(
      ({ validator }) => validator
    ),
    [formSubmitted, setFormSubmitted] = useState(false),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_RESULT_MODAL());

  const { department = "", patient = {}, _id } = selected || {};

  useEffect(() => {
    if (show) {
      dispatch(SetDIAGNOSTIC({ ...(selected[department] || {}) }));
    }
  }, [selected, show, dispatch, department]);

  const deleteRemovedImages = async (existingImages, newImages) => {
    if (!existingImages.length) return;

    const deletedImages = existingImages.filter(
      ({ section: sec, date: dt }) =>
        !newImages.some(({ section, date }) => section === sec && date === dt)
    );

    if (deletedImages.length > 0) {
      await Promise.all(
        deletedImages.map(({ section, date }) =>
          dispatch(
            DESTROY_IMG({
              data: { path: `diagnostics/${_id}/${section}_${date}` },
              token,
            })
          )
        )
      );
    }
  };

  // ⬆ Upload new images
  const uploadNewImages = async (images) => {
    const pendingUploads = images.filter(({ img }) => img);

    if (pendingUploads.length > 0) {
      await Promise.all(
        pendingUploads.map(async (element) => {
          const { section, img, date } = element;
          const buildForm = Cloudinary.buildFileForm(
            img,
            `diagnostics/${_id}`,
            `${section}_${date}`
          );

          const action = await dispatch(UPLOAD({ data: buildForm, token }));

          const index = images.findIndex(
            ({ section: sec, date: dt }) => sec === section && dt === date
          );

          images[index] = { ...images[index], imgId: action.payload.imgId };
        })
      );
    }

    return images;
  };

  // 🔄 Update diagnostic record
  const updateDiagnostic = async (images) => {
    await dispatch(
      UPDATE({
        token,
        data: {
          _id: selected?._id,
          [department]: {
            ...diagnostic,
            ...(images.length > 0
              ? { images: images.map(({ img, ...rest }) => rest) }
              : {}),
          },
        },
      })
    );
  };

  const handleSubmit = async () => {
    const haveResults = Boolean(results?.length);
    const haveForms = Boolean(Object.keys(diagnostic).length);

    if (haveResults && !haveForms) {
      await Swal.fire({
        icon: "warning",
        title: "Result Form Required",
        text: "Please select a section from the patient's result record or upload a result form before submitting.",
      });
      return;
    }

    if (!haveResults && !haveForms) {
      await Swal.fire({
        icon: "warning",
        title: "No Result Form",
        text: "You need to upload at least one result form before submitting.",
      });
      return;
    }
    setFormSubmitted(true);

    let images = [...(diagnostic?.images || [])];
    const { images: existingImages = [] } = selected[department] || {};

    // 🔹 Step 1: Delete removed images
    await deleteRemovedImages(existingImages, images);

    // 🔹 Step 2: Upload new images
    images = await uploadNewImages(images);

    // 🔹 Step 3: Update record
    await updateDiagnostic(images);

    setFormSubmitted(false);
    dispatch(SetDIAGNOSTIC({}));
    toggle();
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      size={isLoading ? "fluid" : !results?.length ? "lg" : "fluid"}
    >
      <MDBModalHeader
        toggle={toggle}
        className=" light-blue darken-3 white-text"
      >
        <div className="my-n3">
          <MDBIcon fab icon="wpforms" className="mr-2" />
          {department === "lab" ? "Laboratory" : "Radiology"} Result Form
          <h6 style={{ marginLeft: "-5px" }}>
            {getGenderIcon(patient?.isMale)} {fullName(patient?.fullName)} |{" "}
            {getAge(patient?.dob)}
          </h6>
        </div>
      </MDBModalHeader>

      <MDBModalBody>
        <MDBRow>
          <Records />
          <MDBCol>
            <Images />
          </MDBCol>
        </MDBRow>
        <div className="text-right mt-3">
          <MDBBtn
            size="md"
            color="info"
            onClick={handleSubmit}
            disabled={formSubmitted}
          >
            Submit <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
