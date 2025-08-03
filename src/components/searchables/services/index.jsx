import React from "react";
import { Services as ServicesSchema } from "./../../../services/fakeDb";
import { Select } from "../../../components/customizable";

const Services = ({ template, service, setService }) => {
  const services = ServicesSchema.filterByTemplate(template);
  const handleChange = (id) => setService(Number(id));

  return (
    <div style={{ bottom: -15, width: 300, marginLeft: 10 }}>
      <Select
        collections={services}
        keys={["id"]}
        values={["name"]}
        // preValue={service}
        onChange={handleChange}
        label="Choose a service"
        disableSearch={services.length < 10}
        inputClassName="text-white"
        className="selectHeader"
      />
    </div>
  );
};

export default Services;
