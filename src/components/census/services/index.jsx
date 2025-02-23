import React from "react";
import { useLocation } from "react-router-dom";

const Census = () => {
  const { search } = useLocation(),
    query = new URLSearchParams(search),
    month = query.get("month"),
    year = query.get("year");

  return (
    <div>
      <h3 className="text-center">{(month, year)}</h3>
    </div>
  );
};

export default Census;
