import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { currency } from "../../../../../services/utilities";

const Gross = ({ searchKey, searchValue }) => {
  const { catalogs } = useSelector(({ sales }) => sales),
    [gross, setGross] = useState(0);

  useEffect(() => {
    setGross(catalogs?.reduce((tot, { amount }) => tot + amount, 0));
  }, [catalogs]);

  useEffect(() => {
    setGross(
      catalogs
        ?.filter((model) => model[searchKey] === searchValue)
        .reduce((tot, { amount }) => tot + amount, 0)
    );
  }, [searchValue]);

  return (
    <div>
      {catalogs.length > 0 && (
        <>
          <span>Gross :</span>
          <span>
            {currency(gross)} @ {catalogs.length} patient/s
          </span>
        </>
      )}
    </div>
  );
};

export default Gross;
