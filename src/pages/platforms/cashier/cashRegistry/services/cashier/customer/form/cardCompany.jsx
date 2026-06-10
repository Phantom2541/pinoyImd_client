import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBIcon } from "mdbreact";
import { SetCH } from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";

export default function CardCompany() {
  const dispatch = useDispatch();
  const { cardHolder = {}, sourceId } = useSelector(
      ({ pos }) => pos,
    ),
    { collections = [] } = useSelector(({ providers }) => providers);

  const type =
    cardHolder?.type ||
    (cardHolder?.provider === "phi"
      ? "phi"
      : ["mbs", "ctr"].includes(cardHolder?.provider)
        ? cardHolder?.provider
        : cardHolder?.provider
          ? "wls"
          : "");
  const { company = {}, tier = "" } = cardHolder;

  const selectedSource = useMemo(
    () =>
      collections.find(({ _id = "", clients = {} }) => {
        const clientId = clients?._id || _id;
        return String(clientId) === String(sourceId || "");
      }) || {},
    [collections, sourceId],
  );

  useEffect(() => {
    if (!["mbs", "ctr"].includes(type)) return;

    const sourceName =
      selectedSource?.clients?.displayname ||
      selectedSource?.displayname ||
      selectedSource?.name ||
      "";
    const nextTier =
      type === "mbs" ? selectedSource?.membership || "" : selectedSource?.contract || "";
    const nextRef = sourceId || "";

    if (
      company?.name === sourceName &&
      company?.ref === nextRef &&
      tier === nextTier
    ) {
      return;
    }

    dispatch(
      SetCH({
        provider: type,
        type,
        company: {
          name: sourceName,
          ref: nextRef,
          employer: "",
          label: sourceName,
        },
        tier: nextTier,
      }),
    );
  }, [company?.name, company?.ref, dispatch, selectedSource, sourceId, tier, type]);

  if (type === "mbs" || type === "ctr") {
    const sourceLabel =
      selectedSource?.clients?.displayname ||
      selectedSource?.displayname ||
      selectedSource?.name ||
      "";
    const tierLabel = type === "mbs" ? selectedSource?.membership : selectedSource?.contract;

    return (
      <div className="patient-form mt-2">
        <span>{type === "mbs" ? "Membership Source" : "Contract Source"}</span>
        <div
          className="d-flex align-items-center"
          style={{
            minHeight: "38px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            padding: "0 12px",
            color: sourceLabel ? "#495057" : "#6c757d",
            background: "#fff",
            gap: "8px",
          }}
        >
          <MDBIcon icon={type === "mbs" ? "id-card" : "building"} />
          <span>
            {sourceLabel
              ? `${sourceLabel}${tierLabel ? ` - ${tierLabel}` : ""}`
              : `Select a ${type === "mbs" ? "membership" : "contract"} source first`}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
