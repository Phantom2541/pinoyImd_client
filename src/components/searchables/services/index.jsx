import React from "react";
import { Services as ServicesSchema } from "./../../../services/fakeDb";
import { Select } from "../../../components/customizable";

const Services = ({ template, service, setService }) => {
  const services = ServicesSchema.filterByTemplate(template);

  const handleChange = (id) => setService(Number(id));

  return (
    <div style={{ position: "absolute", left: 350, bottom: -15, width: 300 }}>
      <Select
        collections={services}
        keys={["id"]}
        values={["name"]}
        preValue={service}
        onChange={handleChange}
        label="Choose a service"
        disableSearch={services.length < 10}
        inputClassName="text-white"
      />
    </div>
  );
};

export default Services;
