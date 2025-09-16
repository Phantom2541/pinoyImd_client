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
import { UPLOAD } from "../../../../../services/redux/slices/assets/persons/auth";
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

    let images = [...(diagnostic?.images || [])];
    const _images = images.filter(({ img }) => img);
    setFormSubmitted(true);
    if (_images.length > 0) {
      await Promise.all(
        _images.map(async (element) => {
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

    dispatch(
      UPDATE({
        token,
        data: {
          _id: selected?._id,
          [department]: {
            ...diagnostic,
            ...(images.length > 0
              ? {
                  images: images.map(({ img, ...rest }) => rest),
                }
              : {}),
          },
        },
      })
    ).then(() => {
      setFormSubmitted(false);
      dispatch(SetDIAGNOSTIC({}));
      toggle();
    });
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
