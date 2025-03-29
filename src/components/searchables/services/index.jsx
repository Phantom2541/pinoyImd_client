import React, { useEffect } from "react";
import { Services as ServicesSchema } from "./../../../services/fakeDb";
import { CustomSelect } from "../../../components/searchables";

const Services = ({ template, service, setService }) => {
  useEffect(() => {
    const services = ServicesSchema.filterByTemplate(template);
    setService(services.length > 0 ? services[0].id : null);
  }, [template, setService]); // ✅ Now, no ESLint warning

  const services = ServicesSchema.filterByTemplate(template);

  const handleChange = (value) => {
    setService(Number(value)); // Update selected service
  };

  return (
    <div style={{ position: "absolute", left: 350, bottom: -15, width: 300 }}>
      <CustomSelect
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
