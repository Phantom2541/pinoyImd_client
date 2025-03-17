import React from "react";
import { MDBAnimation, MDBCard } from "mdbreact";
import Header from "./header";
const Products = () => {
  return (
    <MDBAnimation type="slideInLeft">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Products;
