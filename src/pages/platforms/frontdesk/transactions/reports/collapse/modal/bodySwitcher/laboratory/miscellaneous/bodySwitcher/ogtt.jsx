import React from "react";
import { MDBInput } from "mdbreact";

export default function Ogtt({ task, setTask }) {
  const { results = false } = task;

  const handleChange = (name, value) =>
    setTask({ ...task, results: { ...results, [name]: value } });

  console.log(task);
  return (
    <>
      <MDBInput
        type="number"
        label="Fasting Blood Sugar"
        value={results?.fbs}
        onChange={(e) => handleChange("fbs", e.target.value)}
        required
      />
      <MDBInput
        type="number"
        label="1st Hour"
        value={results?.fhr}
        onChange={(e) => handleChange("fhr", e.target.value)}
        required
      />
      <MDBInput
        type="number"
        label=" 2nd Hour"
        value={results?.shr}
        onChange={(e) => handleChange("shr", e.target.value)}
        required
      />
    </>
  );
}
