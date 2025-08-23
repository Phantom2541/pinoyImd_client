import { useState } from "react";
import Description from "./description";
import Media from "./media";
import Product from "./product";
import SalesInformation from "./salesInformation";
import Specifications from "./specification";

const Details = ({ product }) => {
  const [info, setInfo] = useState({});
  const [variants, setVariants] = useState({});
  const [images, setImages] = useState({ covers: [null, null, null, null] });
  const [isDuplicate, setIsDuplicate] = useState(false);
  return (
    <>
      <Product product={product} />
      <Specifications />
      <Description />
      <SalesInformation
        variants={variants}
        setVariants={setVariants}
        info={info}
        setInfo={setInfo}
        setIsDuplicate={setIsDuplicate}
      />
      <Media variants={variants} images={images} setImages={setImages} />
    </>
  );
};

export default Details;
