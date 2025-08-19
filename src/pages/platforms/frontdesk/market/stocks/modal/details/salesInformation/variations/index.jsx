import { useState } from "react";
import Variant from "./variant";

const Variations = () => {
  const [variants, setVariants] = useState({ types: [{}] });
  return (
    <div>
      <Variant />
      <Variant />
    </div>
  );
};

export default Variations;
