import Chemistry from "./chemistry";
import Hematology from "./hematology";
import Parasitology from "./parasitology";
import Urinalysis from "./urinalysis";

const Laboratory = async ({ form, task }) => {
  switch (form) {
    case "Hematology":
      await Hematology({ form, task });
      break;

    case "Urinalysis":
      await Urinalysis({ form, task });
      break;

    case "Parasitology":
      await Parasitology({ form, task });
      break;
    case "Chemistry":
      await Chemistry({ form, task });
      break;
    default:
      break;
  }
};

export default Laboratory;
