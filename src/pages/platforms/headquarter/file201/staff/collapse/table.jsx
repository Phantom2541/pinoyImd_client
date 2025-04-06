import React, { useCallback, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { MDBRow, } from "mdbreact";
// MDBCol, MDBIcon, MDBBadge
import { useForm } from "react-hook-form";
import "./styles.css";
// import { Policy } from "../../../../../../services/fakeDb";
import AccessModal from "./accessModal";
// import {
//   SETOnHotSEAT,
//   SetUPDATE_TRACKER,
// } from "../../../../../../services/redux/slices/assets/persons/personnels";
// import { currency } from "../../../../../../services/utilities";

// function EditableField({
//   label,
//   fieldName,
//   editField,
//   setEditField,
//   updateTracker,
//   errors,
//   saveField,
//   handleCancel,
//   value,
//   children,
//   isUpdate = false,
//   isMoney = true,
// }) {
//   const { fieldName: fieldNameUpdate, isLoading } = updateTracker;
//   const isDepartment = label === "Department";
//   const isEditing = isDepartment
//     ? true
//     : value
//     ? editField === fieldName || isUpdate
//     : true;
//   const formattedValue = Number(value) && isMoney ? currency(value) : value;

//   return (
//     <div className="editable-field d-flex align-items-center mt-1 ">
//       <strong style={{ fontSize: "0.9rem", color: "#757575" }} className="text-nowrap">
//         {label}:
//       </strong>
//       {isEditing ? (
//         <div className="input-inline ml-2 position-relative">
//           {children}
//           {!isDepartment && (
//             <div className="d-flex" style={{ position: "absolute", right: "0.3rem" }}>
//               <div className="mr-1">
//                 {isLoading && fieldNameUpdate === fieldName ? (
//                   <MDBIcon icon="spinner" pulse />
//                 ) : (
//                   <MDBIcon
//                     icon="check"
//                     className="icon-inline"
//                     onClick={() => saveField(fieldName, fieldName)}
//                   />
//                 )}
//               </div>
//               <div style={{ width: "25px" }} className="bg-white">
//                 <MDBIcon
//                   icon="times"
//                   className="icon-inline cancel"
//                   onClick={() => handleCancel()}
//                 />
//               </div>
//             </div>
//           )}
//           {errors[fieldName] && (
//             <div className="invalid-feedback">{errors[fieldName].message}</div>
//           )}
//         </div>
//       ) : (
//         <span onClick={() => setEditField(fieldName)}>
//           {formattedValue || "N/A"}
//         </span>
//       )}
//     </div>
//   );
// }

export default function CollapseTable({ employment, rate, contribution, _id, onSubmit }) {
  // const { updateTracker } = useSelector(({ personnels }) => personnels);
  // const [editField, setEditField] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});
  // const dispatch = useDispatch();

  const toggle = () => {
    setSelected({});
    
    setShow(!show)
  };

  const {
    // register,
    // handleSubmit,
    // formState: { errors },
    // watch,
    reset,
    // setValue,
  } = useForm();

  const resetData = useCallback(() => {
    reset({
      employmentHor: employment?.hos || 0,
      employmentSoe: employment?.soe || "",
      employmentPc: employment?.pc || 0,
      employmentDesignation: employment?.designation || 0,
      rateMonthly: rate?.monthly || 0,
      rateCola: rate?.cola || 0,
      rateDaily: rate?.daily || 0,
      contributionPh: contribution?.ph || 0,
      contributionPi: contribution?.pi || 0,
      contributionSss: contribution?.sss || 0,
    });
  }, [reset, contribution, rate, employment]);

  useEffect(() => {
    resetData();
  }, [resetData]);

  // const saveField = handleSubmit((data, fieldName) => {
  //   onSubmit({ _id, ...data });
  //   dispatch(SetUPDATE_TRACKER(fieldName));
  //   setEditField(null);
  // });

  // const handleCancel = () => {
  //   resetData();
  //   setEditField(null);
  // };

  // const handleOnHotSeat = (e) => {
  //   e.preventDefault();
  //   dispatch(SETOnHotSEAT(staff));
  //   setSelected(staff);
  //   toggle();
  // };

  // const { getDepartment, getDefaultDesignation, isValidDesignationForDepartment } = Policy;
  // const { access = [] } = staff || {};
  // const { soe, hos, pc, designation } = employment || {};
  // const hasContract = soe && hos && pc && designation;
  // const department = watch("employmentDepartment");
  // const baseDepartment = department || getDepartment(designation);
  // const departmentHasChange =
  //   department !== getDepartment(employment.designation) && department;

  // useEffect(() => {
  //   if (!isValidDesignationForDepartment(employment?.designation, baseDepartment)) {
  //     setValue("employmentDesignation", getDefaultDesignation(baseDepartment));
  //   }

  //   if (!baseDepartment) {
  //     setValue("employmentDepartment", "DEFAULT");
  //   }
  // }, [
  //   employment?.designation,
  //   baseDepartment,
  //   setValue,
  //   getDefaultDesignation,
  //   isValidDesignationForDepartment,
  // ]);

  return (
    <>
      <MDBRow>
        {/* Left Column */}
        {/* Rate Column */}
        {/* Contribution Column */}
        {/* Access Column */}
        {/* Your UI markup remains the same */}
      </MDBRow>
      <AccessModal show={show} toggle={toggle} selected={selected} />
    </>
  );
}
