import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Diagnostics from "./diagnostics";
import Suppliers from "./suppliers";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";
import Loading from "./diagnostics/loading";

const diagnosticsCategories = [
  "diagnostic",
  "clinic",
  "laboratory",
  "radiology",
  "pharmacy",
  "infirmary",
  "hospital",
  "rehabilitation",
];

export default function CompanyCategorySwitcher() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { details, isLoading, message } = useSelector(
    ({ companies }) => companies
  );

  const category = useMemo(
    () => details?.category?.toLowerCase() || null,
    [details]
  );
  const hasResolvedDetails = Boolean(details?._id);

  useEffect(() => {
    dispatch(GET_DETAILS({ key: { companyId } }));
    localStorage.setItem("companyId", companyId);
  }, [companyId, dispatch]);

  if (isLoading || !hasResolvedDetails) return <Loading />;

  if (category && diagnosticsCategories.includes(category)) {
    return <Diagnostics />;
  }

  if (category === "supplier") {
    return <Suppliers />;
  }

  return (
    <div className="text-center py-5">
      {message || `Unknown category: ${category || "unavailable"}`}
    </div>
  );
}
