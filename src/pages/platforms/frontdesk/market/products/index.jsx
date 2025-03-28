import React from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
} from "mdbreact";
import Header from "./header";
import { TOGGLE } from "../../../../../services/redux/slices/market/products";
import { useDispatch } from "react-redux";
import ModalProduct from "./modal";

const Products = () => {
  const dispatch = useDispatch();
  const toggle = () => dispatch(TOGGLE());

  return (
    <>
      <MDBAnimation type="slideInLeft">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBContainer className="mt-3">
            <MDBRow className="row-cols-4 row-cols-md-3 g-1 ">
              <MDBCol md="3" size="6" className="mb-3" onClick={() => toggle()}>
                <MDBCard>
                  <MDBCardImage
                    style={{ height: "200px", width: "100%" }}
                    src="https://mdbootstrap.com/img/new/standard/city/041.webp"
                    alt="..."
                    position="top"
                  />
                  <MDBCardBody>
                    <MDBCardTitle>Card title</MDBCardTitle>
                    <MDBCardText className="text-truncate">
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </MDBCardText>
                    <div className="d-flex justify-content-between align-items-center">
                      <MDBBtn href="#" color="success">
                        <MDBIcon icon="shopping-cart" />
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBCard>
      </MDBAnimation>
      <ModalProduct />
    </>
  );
};

export default Products;
