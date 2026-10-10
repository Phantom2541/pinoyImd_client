import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Diagnostics from "./diagnostics";
import Suppliers from "./suppliers";
import {
  GET_DETAILS,
  SeedDetails,
} from "../../services/redux/slices/assets/companies";
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

  const { details, message } = useSelector(({ companies }) => companies);

  const category = useMemo(
    () => details?.category?.toLowerCase() || null,
    [details],
  );
  // Details for THIS company -- already in memory, or the copy kept in the
  // browser from the last visit -- show at once and refresh in the background.
  const hasDetailsForCompany = details?._id === companyId;

  useEffect(() => {
    let known = hasDetailsForCompany;

    if (!known) {
      try {
        const cached = JSON.parse(localStorage.getItem("patronCompany"));

        if (cached?._id === companyId) {
          dispatch(SeedDetails(cached));
          known = true;
        }
      } catch (error) {
        // No usable copy: show the loading screen until the details arrive.
      }
    }

    dispatch(GET_DETAILS({ key: { companyId }, silent: known }));
    localStorage.setItem("companyId", companyId);
    // Only when the company changes: the details arriving must not re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, dispatch]);

  if (!hasDetailsForCompany) return <Loading />;

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
