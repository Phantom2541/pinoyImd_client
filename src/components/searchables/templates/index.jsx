import React from "react";
import { Templates as templates } from "./../../../services/fakeDb";

const Templates = ({ setTemplate }) => {
  const template = templates?.collections?.find(
    ({ department }) => department === "LAB"
  );

  const components = template ? template.components : [];

  const handleChange = (e) => {
    e.preventDefault();
    setTemplate(Number(e.target.value));
  };

  return (
    <div style={{ position: "absolute", left: 200, bottom: 7, width: 130 }}>
      <select className="browser-default custom-select" onChange={handleChange}>
        <option value="" disabled>
          Choose a template
        </option>
        <option value={-1}>Show All</option>
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
