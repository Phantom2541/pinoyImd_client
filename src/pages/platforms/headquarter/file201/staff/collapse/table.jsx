import React, { useState } from "react";
import { MDBCol, MDBRow, MDBIcon } from "mdbreact";
import { useForm } from "react-hook-form";
import "./styles.css";
import { Roles } from "../../../../../../services/fakeDb";
function EditableField({
  label,
  fieldName,
  editField,
  setEditField,
  register,
  errors,
  saveField,
  handleCancel,
  value,
  children,
}) {
  const isEditing = editField === fieldName;

  return (
    <div className="editable-field">
      <strong>{label}:</strong>
      {isEditing ? (
        <div className="input-inline">
          {children}
          <MDBIcon
            icon="check"
            className="icon-inline"
            onClick={() => saveField(fieldName)}
          />
          <MDBIcon
            icon="times"
            className="icon-inline cancel"
            onClick={() => handleCancel(fieldName)}
          />
          {errors[fieldName] && (
            <div className="invalid-feedback">{errors[fieldName].message}</div>
          )}
        </div>
      ) : (
        <span onClick={() => setEditField(fieldName)}>{value || "N/A"}</span>
      )}
    </div>
  );
}

export default function CollapseTable({
  employment,
  access = [],
  rate,
  contribution,
  _id,
  onSubmit,
}) {
  console.log(employment);
  const [editField, setEditField] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      employmentHor: employment?.hos || "",
      employmentSoe: employment?.soe || "",
      employmentPc: employment?.pc || 0,
      employmentDesignation: employment?.designation || 0,
      rateMonthly: rate?.monthly || 0,
      rateCola: rate?.cola || 0,
      rateDaily: rate?.daily || 0,
      contributionPh: contribution?.ph || 0,
      contributionPi: contribution?.pi || 0,
      contributionSss: contribution?.sss || 0,
    },
  });

  const saveField = handleSubmit((data) => {
    onSubmit({
      _id,
      ...data,
    });
    setEditField(null);
  });

  const handleCancel = (field) => {
    reset({ [field]: employment[field] || rate[field] || contribution[field] });
    setEditField(null);
  };

  return (
    <MDBRow>
      <MDBCol md={3}>
        <h5>Employment</h5>
        <hr />
        <EditableField
          label="Hours of Service"
          fieldName="employmentHor"
          editField={editField}
          setEditField={setEditField}
          register={register}
          errors={errors}
          saveField={saveField}
          handleCancel={handleCancel}
          value={employment?.hor}
        >
          <input
            type="number"
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
          register={register}
          errors={errors}
          saveField={saveField}
          handleCancel={handleCancel}
          value={employment?.soe}
        >
          <select
            {...register("employmentSoe")}
            className={`form-control form-control-sm ${
              errors.employmentSoe ? "is-invalid" : ""
            }`}
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
          setEditField={setEditField}
          register={register}
          errors={errors}
          saveField={saveField}
          handleCancel={handleCancel}
          value={rate?.monthly}
        >
          <input
            type="number"
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
          setEditField={setEditField}
          register={register}
          errors={errors}
          saveField={saveField}
          handleCancel={handleCancel}
          value={rate?.cola}
        >
          <input
            type="number"
            {...register("rateCola")}
            className={`form-control form-control-sm ${
              errors.rateCola ? "is-invalid" : ""
            }`}
          />
        </EditableField>

        <EditableField
          label="Daily Rate"
          fieldName="rateDaily"
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
            {...register("rateDaily")}
            className={`form-control form-control-sm ${
              errors.rateDaily ? "is-invalid" : ""
            }`}
          />
        </EditableField>
      </MDBCol>

      <MDBCol md={3}>
        <h5>Contribution</h5>
        <hr />
        <EditableField
          label="PH"
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
          saveField={saveField}
          handleCancel={handleCancel}
          value={contribution?.pi}
        >
          <input
            type="number"
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
          errors={errors}
          saveField={saveField}
          handleCancel={handleCancel}
          value={contribution?.sss}
        >
          <input
            type="number"
            {...register("contributionSss")}
            className={`form-control form-control-sm ${
              errors.contributionSss ? "is-invalid" : ""
            }`}
          />
        </EditableField>
      </MDBCol>
      <MDBCol md={3}>
        <h5>Access</h5>
        <hr />
        {access.length > 0 ? (
          access.map((acc, index) => <p key={index}>{acc}</p>)
        ) : (
          <p>No Access</p>
        )}
      </MDBCol>
    </MDBRow>
  );
}
