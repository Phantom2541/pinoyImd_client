import React from "react";
import { Services as ServicesSchema } from "./../../../services/fakeDb";

const Services = ({ template, service, setService }) => {
  const services = ServicesSchema.filterByTemplate(template);

  const handleChange = (e) => {
    e.preventDefault();
    console.log(Number(e.target.value));

    setService(Number(e.target.value));
  };

  return (
    <div style={{ position: "absolute", left: 320, width: 200 }}>
      <select
        defaultValue=""
        className="browser-default custom-select"
        onChange={handleChange}
        value={service}
      >
        <option value="" disabled>
          Choose a service
        </option>
        {services.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Services;
