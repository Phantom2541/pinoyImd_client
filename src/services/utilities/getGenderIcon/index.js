import React from "react";

const getPhysicianGenderIcon = (isMale, isGhost) => (
  <span style={{ fontSize: "20px" }}>
    {isGhost ? "👻" : isMale ? "👨‍⚕️" : "👩‍⚕️"}
  </span>
);

const getGenderIcon = (isMale) => (
  <span style={{ fontSize: "20px" }} title={isMale ? "Male" : "Female"}>
    {isMale ? "♂️" : "♀️"}
  </span>
);

export { getPhysicianGenderIcon, getGenderIcon };
