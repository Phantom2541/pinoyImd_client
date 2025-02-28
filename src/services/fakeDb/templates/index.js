import collections from "./collections.json";

const Services = {
  collections,
  getTemplate: (department, templateIndex) => {
    if (!department) return "Department not found!";

    const { components = [] } =
      collections.find(({ department: dep }) => dep === department) || {};

    console.log(components);

    if (components?.length === 0) return "Template not found!";

    return components[templateIndex] || "Template not found!";
  },
};

export default Services;
