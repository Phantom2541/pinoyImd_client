import { useEffect, useState } from "react";

import ResultPrintout from "./results";
import BarcodePrintout from "./barcodes";

const RequestForms = () => {
  const [sale, setSale] = useState({});
  const [forms, setForms] = useState(null);
  const [ssx, setSsx] = useState(null);
  const [isResult, setIsResult] = useState(false);

  useEffect(() => {
    const {
      forms,
      deal,
      isResult: isRe = false,
    } = JSON.parse(localStorage.getItem("inhouse"));
    setSale(deal);
    setForms(forms);
    setSsx(localStorage.getItem("ssx") || "");
    setIsResult(isRe);
  }, []);

  console.log("sale", sale);
  if (!sale || !sale?._id) return <div>Sale is Empty</div>;
  return (
    <div className="bg-white vh-100">
      {isResult ? (
        <ResultPrintout sale={sale} forms={forms} ssx={ssx} />
      ) : (
        <BarcodePrintout sale={sale} forms={forms} />
      )}
    </div>
  );
};

export default RequestForms;
