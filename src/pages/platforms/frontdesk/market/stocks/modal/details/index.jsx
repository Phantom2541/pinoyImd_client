import Description from "./description";
import Media from "./media";
import Product from "./product";
import SalesInformation from "./salesInformation";
import Specifications from "./specification";

const Details = ({ product }) => {
  return (
    <>
      <Product product={product} />
      <Specifications />
      <Description />
      <SalesInformation />
      <Media />
    </>
  );
};

export default Details;
