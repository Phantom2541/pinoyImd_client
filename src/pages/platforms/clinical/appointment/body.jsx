import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  MDBBadge,
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import {
  UPDATE,
  setShowModalEhr,
  setShowModalVs,
  SetRESULT,
  SetTRANSAC,
} from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import {
  Cloudinary,
  formattedQn,
  fullName,
  PresetImage,
} from "../../../../services/utilities";
import {
  EditableField,
  EditableSelect,
} from "../../../../components/customizable";
import { HMO, VisityType } from "../../../../services/fakeDb";
import HealthCardFields from "../../cashier/cashRegistry/services/cashier/customer/form/healthCard";
import Notes from "./notes";

const defaultHealthCard = {
  provider: "",
  number: "",
  memberType: "",
  relationship: "",
  employer: "",
  plan: "",
  expiry: "",
  account: "",
};

const sanitizeHealthCard = (card = {}) => {
  const nextCard = { ...card };
  const isPhilHealth = nextCard.provider === "phi";

  if (nextCard.memberType !== "dependent") {
    delete nextCard.relationship;
    delete nextCard.account;
  }

  if (isPhilHealth) {
    delete nextCard.plan;
    delete nextCard.expiry;
  }

  Object.keys(nextCard).forEach((key) => {
    const value = nextCard[key];

    if (value === "" || value === null || value === undefined) {
      delete nextCard[key];
    }
  });

  return nextCard;
};

const getHealthCardLabel = ({ provider = "", number = "" }) => {
  const label =
    provider === "phi"
      ? "PhilHealth"
      : HMO.getAbbr(provider) || HMO.getName(provider) || "Health Card";

  return `${label}${number ? ` - ${number}` : ""}`;
};

const initialModalState = {
  show: false,
  appointmentId: "",
  patientId: "",
  patientName: "",
  healthCards: [],
  editingIndex: -1,
};

const Body = () => {
  const {
      collections,
      filtered,
      activePage,
      maxPage,
      formSubmitted,
      isSuccess,
      activeSched,
    } = useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  const [healthCardModal, setHealthCardModal] = useState(initialModalState);
  const [healthCardDraft, setHealthCardDraft] = useState(defaultHealthCard);

  const handleUpdate = (data) => {
    console.log("update request:", data);

    const { _id, ...rest } = data;

    if (
      "mobile" in rest ||
      "email" in rest ||
      "dob" in rest ||
      "fullName" in rest ||
      "healthCard" in rest
    ) {
      dispatch(
        UPDATE({
          token,
          data: {
            _id,
            patient: {
              _id: data.patientId || data._id,
              ...rest,
            },
          },
        }),
      );
    } else {
      dispatch(UPDATE({ token, data }));
    }
  };

  useEffect(() => {
    console.log("filtered", filtered);
    console.log("collections", collections);
  }, [filtered, collections]);

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedData = [...filtered].sort((a, b) => {
    const order = { done: 1, confirmed: 2 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  const paginatedData = sortedData.slice(startIndex, endIndex);

  const statusColors = {
    draft: "info",
    confirmed: "primary",
    cancelled: "danger",
  };

  const getCardColor = (card) => {
    if (!card.isActive) return "danger";
    if (!card.verified) return "warning";

    return "success";
  };

  const closeHealthCardModal = () => {
    setHealthCardModal(initialModalState);
    setHealthCardDraft(defaultHealthCard);
  };

  const openHealthCardModal = ({
    appointmentId,
    patientId,
    patientName,
    healthCards = [],
    editingIndex = -1,
  }) => {
    const cards = Array.isArray(healthCards) ? healthCards : [];
    const selectedCard =
      editingIndex > -1 ? cards[editingIndex] || defaultHealthCard : {};

    setHealthCardModal({
      show: true,
      appointmentId,
      patientId,
      patientName,
      healthCards: cards,
      editingIndex,
    });
    setHealthCardDraft({
      ...defaultHealthCard,
      ...selectedCard,
      account: selectedCard?.account || "",
    });
  };

  const handleSaveHealthCard = () => {
    const sanitizedCard = sanitizeHealthCard(healthCardDraft);

    if (!sanitizedCard.provider) {
      return addToast("Please select a provider first.", {
        appearance: "warning",
      });
    }

    if (!sanitizedCard.number) {
      return addToast("Card / account number is required.", {
        appearance: "warning",
      });
    }

    if (!sanitizedCard.memberType) {
      return addToast("Member type is required.", {
        appearance: "warning",
      });
    }

    const nextHealthCards = [...healthCardModal.healthCards];

    if (healthCardModal.editingIndex > -1) {
      nextHealthCards[healthCardModal.editingIndex] = {
        ...nextHealthCards[healthCardModal.editingIndex],
        ...sanitizedCard,
      };
    } else {
      nextHealthCards.push(sanitizedCard);
    }

    handleUpdate({
      _id: healthCardModal.appointmentId,
      patientId: healthCardModal.patientId,
      healthCard: nextHealthCards,
    });

    closeHealthCardModal();
  };

  return (
    <>
      <MDBTable bordered className="m-0 p-0" small>
        <MDBTableHead>
          <tr>
            {!activeSched && <th>Schedule</th>}
            <th>No.</th>
            <th>Img</th>
            <th>Patient</th>
            <th>Visit Type</th>
            <th className="text-center">Laboratory</th>
            <th className="text-center">Radiology</th>
            <th className="text-center" title="electronic Medical Records">
              eMR
            </th>
            <th title="Vital Sign">VS</th>
            <th>Contact number</th>
            <th>Remarks</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => {
              const {
                patient,
                remarks,
                status,
                qn,
                visitType,
                ehr,
                consultation,
                _id,
                sched,
                lab = {},
                rad = {},
              } = item;
              const hasLab = Object.keys(lab).length > 0;
              const hasRad = Object.keys(rad).length > 0;
              const patientHealthCards = Array.isArray(patient?.healthCard)
                ? patient.healthCard.reduce((result, card, cardIndex) => {
                    if (card?.provider || card?.number) {
                      result.push({ ...card, originalIndex: cardIndex });
                    }

                    return result;
                  }, [])
                : [];

              const photoURL = `${Cloudinary.getEndpoint()}/${
                patient?.pid || ""
              }/users/${patient?.email}/profile`;

              return (
                <tr key={index}>
                  {!activeSched && <td>{sched}</td>}
                  <td>{formattedQn(qn, filtered)}</td>

                  <td>
                    <img
                      src={photoURL}
                      alt="avatar"
                      className="rounded-circle"
                      onError={(e) =>
                        (e.target.src = PresetImage(patient?.isMale))
                      }
                      style={{ width: "40px", height: "40px" }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {fullName(patient?.fullName)}
                    </div>
                    <div className="d-flex align-items-start mt-1">
                      <div className="d-flex flex-wrap align-items-center">
                        {patientHealthCards.length > 0 ? (
                          patientHealthCards.map((card) => (
                            <MDBBadge
                              key={`${card.provider || "health-card"}-${
                                card.number || card.originalIndex
                              }`}
                              color={getCardColor(card)}
                              pill
                              className="mr-1 mb-1 cursor-pointer"
                              title="Edit health card"
                              onClick={() =>
                                openHealthCardModal({
                                  appointmentId: _id,
                                  patientId: patient?._id,
                                  patientName: fullName(patient?.fullName),
                                  healthCards: patient?.healthCard,
                                  editingIndex: card.originalIndex,
                                })
                              }
                            >
                              {getHealthCardLabel(card)}
                              {!card.isActive ? " (Expired)" : ""}
                            </MDBBadge>
                          ))
                        ) : (
                          <small className="text-muted mr-2">
                            No health card tagged
                          </small>
                        )}
                      </div>
                      <MDBBtn
                        type="button"
                        size="sm"
                        color="info"
                        rounded
                        className="px-2 py-1 ml-1 mt-0"
                        title="Add health card"
                        onClick={() =>
                          openHealthCardModal({
                            appointmentId: _id,
                            patientId: patient?._id,
                            patientName: fullName(patient?.fullName),
                            healthCards: patient?.healthCard,
                          })
                        }
                      >
                        <MDBIcon icon="plus" />
                      </MDBBtn>
                    </div>
                  </td>

                  <td>
                    <EditableSelect
                      animation
                      animationStyle={{
                        width: "19rem",
                        marginLeft: "-.3rem",
                        marginTop: "0.2rem",
                      }}
                      preValue={visitType}
                      keyForText="label"
                      keyForValue="value"
                      className="mb-n3"
                      isEditable
                      collections={VisityType.collections}
                      fieldData={{
                        _id,
                        label: VisityType.getLabel(visitType),
                      }}
                      onSave={(data) =>
                        handleUpdate({ ...data, visitType: data.value })
                      }
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                    />
                    <MDBBadge
                      color={statusColors[status] || "info"}
                      className="ml-2"
                    >
                      <EditableSelect
                        animation
                        animationStyle={{
                          width: "10rem",
                          marginLeft: "-.3rem",
                          marginTop: "-0.4rem",
                        }}
                        className="mb-n3"
                        preValue={status}
                        keyForText="status"
                        keyForValue="status"
                        isEditable
                        collections={Object.keys(statusColors)}
                        fieldData={{ _id, status }}
                        onSave={handleUpdate}
                        formSubmitted={formSubmitted}
                        isSuccess={isSuccess}
                      />
                    </MDBBadge>

                    {status === "done" && (
                      <>
                        <Notes appointment={item} />

                        <MDBIcon
                          icon="cash-register"
                          onClick={() => dispatch(SetTRANSAC(item))}
                          size="lg"
                          className="ml-3 cursor-pointer"
                          title="Transaction"
                        />
                      </>
                    )}
                  </td>
                  <td className="text-center">
                    <MDBIcon
                      size="lg"
                      onClick={() =>
                        dispatch(SetRESULT({ ...item, department: "lab" }))
                      }
                      icon={hasLab ? "eye" : "plus"}
                      title={
                        !hasLab
                          ? "Add Laboratory Result"
                          : "View Laboratory Result"
                      }
                      className={`text-${
                        hasLab ? "warning" : "primary"
                      } shadow-lg cursor-pointer`}
                    />
                  </td>
                  <td className="text-center">
                    <MDBIcon
                      size="lg"
                      onClick={() =>
                        dispatch(SetRESULT({ ...item, department: "rad" }))
                      }
                      icon={hasRad ? "eye" : "plus"}
                      title={
                        !hasRad
                          ? "Add Radiology Result"
                          : "View Radiology Result"
                      }
                      className={`text-${
                        hasRad ? "warning" : "primary"
                      } shadow-lg cursor-pointer`}
                    />
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(setShowModalEhr({ ...ehr, patient }));
                    }}
                  >
                    {ehr ? "yes" : "no"}
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(
                        setShowModalVs({
                          ...consultation,
                          appointment: _id,
                          patient,
                        }),
                      );
                    }}
                  >
                    {consultation ? "yes" : "no"}
                  </td>
                  <td>
                    <EditableField
                      type="number"
                      keyForValue="mobile"
                      fieldData={{
                        _id,
                        patientId: patient?._id,
                        mobile: patient?.mobile,
                      }}
                      onSave={handleUpdate}
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                    />
                  </td>
                  <td className="position-relative">
                    <EditableField
                      type="text"
                      animation
                      animationStyle={{
                        width: "15rem",
                        marginTop: "-0.4rem",
                      }}
                      keyForValue="remarks"
                      fieldData={{ _id, remarks }}
                      onSave={handleUpdate}
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={11} className="text-center">
                <MDBIcon icon="user-injured" className="mr-2" /> No Patient
                Record
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>

      <MDBModal isOpen={healthCardModal.show} toggle={closeHealthCardModal}>
        <MDBModalHeader
          toggle={closeHealthCardModal}
          className="light-blue darken-3 white-text"
        >
          <MDBIcon icon="id-card" className="mr-2" />
          {healthCardModal.editingIndex > -1 ? "Edit" : "Add"} Health Card
          {healthCardModal.patientName
            ? ` - ${healthCardModal.patientName}`
            : ""}
        </MDBModalHeader>
        <MDBModalBody>
          <div className="mb-3">
            <label>Provider</label>
            <select
              className="form-control"
              value={healthCardDraft.provider || ""}
              onChange={({ target }) =>
                setHealthCardDraft((prev) => ({
                  ...defaultHealthCard,
                  ...prev,
                  provider: target.value,
                }))
              }
            >
              <option value="">Select provider</option>
              <option value="phi">PhilHealth</option>
              {HMO.collections
                .filter(({ code = "" }) => code && code !== "phi")
                .map(({ code = "", abbr = "", name = "" }) => (
                  <option key={code} value={code}>
                    {abbr || name}
                  </option>
                ))}
            </select>
          </div>

          {healthCardDraft.provider && (
            <HealthCardFields
              form={healthCardDraft}
              setForm={setHealthCardDraft}
              providerType={
                healthCardDraft.provider === "phi" ? "philhealth" : "hmo"
              }
            />
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            type="button"
            color="secondary"
            size="sm"
            onClick={closeHealthCardModal}
          >
            Cancel
          </MDBBtn>
          <MDBBtn
            type="button"
            color="info"
            size="sm"
            onClick={handleSaveHealthCard}
          >
            {healthCardModal.editingIndex > -1 ? "Update Card" : "Save Card"}
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};

export default Body;
