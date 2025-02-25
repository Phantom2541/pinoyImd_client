import React from "react";
import { Templates as templates } from "./../../../services/fakeDb";

const Templates = ({ setTemplate }) => {
  const components = templates.find(
    ({ department }) => department === "laboratory"
  ).components;

  const handleChange = (e) => {
    e.preventDefault();
    console.log(Number(e.target.value));

    setTemplate(Number(e.target.value));
  };

  return (
    <div style={{ position: "absolute", left: 120 }}>
      <select className="browser-default custom-select" onChange={handleChange}>
        <option value="" disabled>
          Choose a template
        </option>
        {components.map((template, index) => (
          <option key={template} value={index}>
            {template}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Templates;
