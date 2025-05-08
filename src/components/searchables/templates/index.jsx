import React from "react";
import { Templates as templates } from "./../../../services/fakeDb";

const Templates = ({ setTemplate, Department = "LAB", className = "" }) => {
  const template = templates?.collections?.find(
    ({ department }) => department === Department
  );

  const components = template ? template.components : [];

  const handleChange = (e) => {
    e.preventDefault();
    setTemplate(Number(e.target.value));
  };

  return (
    <div>
      <select className={`${className} form-control`} onChange={handleChange}>
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
