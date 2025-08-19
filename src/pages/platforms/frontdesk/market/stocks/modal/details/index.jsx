import Description from "./description";
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
    </>
  );
};

export default Details;
