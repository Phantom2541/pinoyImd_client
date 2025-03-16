import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCol, MDBRow, MDBIcon, MDBBadge } from "mdbreact";
import { useForm } from "react-hook-form";
import "./styles.css";
import { Roles } from "../../../../../../services/fakeDb";
import AccessModal from "./accessModal";
import {
  SETOnHotSEAT,
  SetUPDATE_TRACKER,
} from "../../../../../../services/redux/slices/assets/persons/personnels";
import { currency } from "../../../../../../services/utilities";

const isNumericString = (str) =>
  typeof str === "string" && Number.isFinite(Number(str));
function EditableField({
  label,
  fieldName,
  editField,
  setEditField,
  updateTracker,
  errors,
  saveField,
  handleCancel,
  value,
  children,
  isMoney = true,
}) {
  // const isEditing = editField === fieldName;
  const { fieldName: fieldNameUpdate, isLoading } = updateTracker;
  const isEditing = value ? editField === fieldName : true;
  const formattedValue = Number(value) && isMoney ? currency(value) : value;
  console.log(isNumericString(value), value);
  // const isEditing = true;
  return (
    <div className="editable-field d-flex align-items-center mt-1 ">
      <strong
        style={{ fontSize: "0.9rem", color: "#757575" }}
        className="text-nowrap"
      >
        {label}:
      </strong>
      {isEditing ? (
        <div className="input-inline ml-2 position-relative">
          {children}
          <div
            className="d-flex"
            style={{ position: "absolute", right: "0.3rem" }}
          >
            <div className="mr-1">
              {isLoading && fieldNameUpdate === fieldName ? (
                <MDBIcon icon="spinner" pulse />
              ) : (
                <MDBIcon
                  icon="check"
                  className="icon-inline"
                  onClick={() => saveField(fieldName, fieldName)}
                />
              )}
            </div>
            <div style={{ width: "25px" }} className="bg-white">
              <MDBIcon
                icon="times"
                className="icon-inline cancel"
                onClick={() => handleCancel()}
              />
            </div>
          </div>
          {errors[fieldName] && (
            <div className="invalid-feedback">{errors[fieldName].message}</div>
          )}
        </div>
      ) : (
        <span onClick={() => setEditField(fieldName)}>
          {formattedValue || "N/A"}
        </span>
      )}
    </div>
  );
}
export default function CollapseTable({
  employment,
  staff,
  rate,
  contribution,
  _id,
  onSubmit,
}) {
  const { updateTracker } = useSelector(({ personnels }) => personnels),
    [editField, setEditField] = useState(null),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const saveField = handleSubmit((data, fieldName) => {
    onSubmit({
      _id,
      ...data,
    });
    dispatch(SetUPDATE_TRACKER(fieldName));
    setEditField(null);
  });

  const handleCancel = () => {
    resetData();
    setEditField(null);
  };

  const handleOnHotSeat = (e) => {
    e.preventDefault();
    dispatch(SETOnHotSEAT(staff));
    setSelected(staff);
    toggle();
  };

  const { access = [] } = staff || {};
  const { soe, hos, pc, designation } = employment || {};
  const hasContract = soe && hos && pc && designation;
  return (
    <>
      <MDBRow>
        <MDBCol md={4}>
          <h5>Contract</h5>
          <hr />
          <EditableField
            label="Hours of Service"
            fieldName="employmentHor"
            editField={editField}
            setEditField={setEditField}
            register={register}
            updateTracker={updateTracker}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={employment?.hos}
            isMoney={false}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("employmentHor")}
              className={`form-control form-control-sm ${
                errors.employmentHor ? "is-invalid" : ""
              }`}
            />
          </EditableField>
          <EditableField
            label="Status of Employment"
            fieldName="employmentSoe"
            editField={editField}
            setEditField={setEditField}
            updateTracker={updateTracker}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={employment?.soe}
          >
            <select
              {...register("employmentSoe")}
              className={`form-control form-control-sm no-arrow ${
                errors.employmentSoe ? "is-invalid" : ""
              }`}
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
            >
              <option value="Contractual">Contractual</option>
              <option value="Reliever">Reliever</option>
              <option value="Permanent">Permanent</option>
              <option value="Honorarium">Honorarium</option>
            </select>
          </EditableField>
          <EditableField
            label="Designation"
            fieldName="employmentDesignation"
            editField={editField}
            setEditField={setEditField}
            updateTracker={updateTracker}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={Roles.findById(employment?.designation)?.display_name}
          >
            <select
              {...register("employmentDesignation")}
              className={`form-control form-control-sm ${
                errors.employmentDesignation ? "is-invalid" : ""
              }`}
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
            >
              <option />
              {Roles.collections.map((role) => (
                <option value={role.id}>{role.display_name}</option>
              ))}
            </select>
          </EditableField>
          <EditableField
            label="Payment Cycle"
            fieldName="employmentPc"
            editField={editField}
            setEditField={setEditField}
            updateTracker={updateTracker}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={
              employment?.pc === 1
                ? "Bi Monthly"
                : employment?.pc === 2
                ? "Monthly"
                : "Quarterly"
            }
          >
            <select
              {...register("employmentPc")}
              className={`form-control form-control-sm ${
                errors.employmentPc ? "is-invalid" : ""
              }`}
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
            >
              <option value={1}>Bi Monthly</option>
              <option value={2}>Monthly</option>
              <option value={3}>Quarterly</option>
            </select>
          </EditableField>
        </MDBCol>

        <MDBCol md={3}>
          <h5>Rate</h5>
          <hr />
          <EditableField
            label="Monthly Rate"
            fieldName="rateMonthly"
            editField={editField}
            updateTracker={updateTracker}
            setEditField={setEditField}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={rate?.monthly}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("rateMonthly")}
              className={`form-control form-control-sm ${
                errors.rateMonthly ? "is-invalid" : ""
              }`}
            />
          </EditableField>

          <EditableField
            label="COLA"
            fieldName="rateCola"
            editField={editField}
            updateTracker={updateTracker}
            setEditField={setEditField}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={rate?.cola}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("rateCola")}
              className={`form-control form-control-sm ${
                errors.rateCola ? "is-invalid" : ""
              }`}
            />
          </EditableField>

          <EditableField
            label="Daily Rate"
            fieldName="rateDaily"
            updateTracker={updateTracker}
            editField={editField}
            setEditField={setEditField}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={rate?.daily}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("rateDaily")}
              className={`form-control form-control-sm ${
                errors.rateDaily ? "is-invalid" : ""
              }`}
            />
          </EditableField>
        </MDBCol>

        <MDBCol md={2}>
          <h5>Contribution</h5>
          <hr />
          <EditableField
            label="PH"
            updateTracker={updateTracker}
            fieldName="contributionPh"
            editField={editField}
            setEditField={setEditField}
            register={register}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={contribution?.ph}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("contributionPh")}
              className={`form-control form-control-sm ${
                errors.contributionPh ? "is-invalid" : ""
              }`}
            />
          </EditableField>

          <EditableField
            label="Pag Ibig"
            fieldName="contributionPi"
            editField={editField}
            setEditField={setEditField}
            register={register}
            errors={errors}
            updateTracker={updateTracker}
            saveField={saveField}
            handleCancel={handleCancel}
            value={contribution?.pi}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("contributionPi")}
              className={`form-control form-control-sm ${
                errors.contributionPi ? "is-invalid" : ""
              }`}
            />
          </EditableField>

          <EditableField
            label="SSS"
            fieldName="contributionSss"
            editField={editField}
            setEditField={setEditField}
            register={register}
            updateTracker={updateTracker}
            errors={errors}
            saveField={saveField}
            handleCancel={handleCancel}
            value={contribution?.sss}
          >
            <input
              type="number"
              style={{
                paddingRight: "55px", // Para may space bago icons
              }}
              {...register("contributionSss")}
              className={`form-control form-control-sm ${
                errors.contributionSss ? "is-invalid" : ""
              }`}
            />
          </EditableField>
        </MDBCol>
        <MDBCol md={3}>
          <div className="d-flex justify-items-center justify-content-between m-0 p-0 ">
            <h5>Access</h5>

            {access.length > 0 && (
              <MDBIcon
                icon="pencil-alt"
                className="mt-2 cursor-pointer"
                onClick={handleOnHotSeat}
                style={{ fontSize: "1.2rem", color: "blue" }}
              />
            )}
          </div>
          <hr className="m-0 p-0 mt-2 mb-3" />
          {access.length > 0 ? (
            access.map((acc, index) => (
              <MDBBadge
                key={index}
                className="mr-2 mb-3"
                pill
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {acc.platform}
              </MDBBadge>
            ))
          ) : (
            <>
              <p className="text-center">No access</p>
              {hasContract ? (
                <p className="text-center">
                  <span
                    className="text-primary font-weight-bold mr-1"
                    style={{ cursor: "pointer" }}
                    onClick={handleOnHotSeat}
                  >
                    Click here
                  </span>
                  to grant access
                </p>
              ) : (
                <small className="text-warning">
                  A contract must be set first before you can add access.
                </small>
              )}
            </>
          )}
        </MDBCol>
      </MDBRow>
      <AccessModal show={show} toggle={toggle} selected={selected} />
    </>
  );
}
