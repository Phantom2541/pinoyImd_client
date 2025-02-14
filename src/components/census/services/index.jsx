import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const Census = () => {
  const [census, setCensus] = useState([]),
    { search, pathname } = useLocation(),
    query = new URLSearchParams(search),
    month = query.get("month"),
    year = query.get("year"),
    dispatch = useDispatch(),
    { collections } = useSelector(({ chemistry }) => chemistry);

  return (
    <div>
      <h3 className="text-center">{(month, year)}</h3>
    </div>
  );
};

export default Census;
