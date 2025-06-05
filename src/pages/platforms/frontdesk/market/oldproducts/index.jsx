// import React from "react";
// import {
//   MDBAnimation,
//   MDBBtn,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBCardText,
//   MDBCardTitle,
//   MDBCol,
//   MDBContainer,
//   MDBIcon,
//   MDBRow,
// } from "mdbreact";
// import Header from "./header";
// import { TOGGLE } from "../../../../../services/redux/slices/market/products";
// import { useDispatch } from "react-redux";
// import ModalProduct from "./modal";

// const Products = () => {
//   const dispatch = useDispatch();
//   const toggle = () => dispatch(TOGGLE());

//   return (
//     <>
//       <MDBAnimation type="slideInLeft">
//         <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
//           <Header />
//           <MDBContainer className="mt-3">
//             <MDBRow className="row-cols-4 row-cols-md-3 g-1 ">
//               <MDBCol md="3" size="6" className="mb-3" onClick={() => toggle()}>
//                 <MDBCard>
//                   <MDBCardImage
//                     style={{ height: "200px", width: "100%" }}
//                     src="https://mdbootstrap.com/img/new/standard/city/041.webp"
//                     alt="..."
//                     position="top"
//                   />
//                   <MDBCardBody>
//                     <MDBCardTitle>Card title</MDBCardTitle>
//                     <MDBCardText className="text-truncate">
//                       This is a longer card with supporting text below as a
//                       natural lead-in to additional content. This content is a
//                       little bit longer.
//                     </MDBCardText>
//                     <div className="d-flex justify-content-between align-items-center">
//                       <MDBBtn href="#" color="success">
//                         <MDBIcon icon="shopping-cart" />
//                       </MDBBtn>
//                     </div>
//                   </MDBCardBody>
//                 </MDBCard>
//               </MDBCol>
//             </MDBRow>
//           </MDBContainer>
//         </MDBCard>
//       </MDBAnimation>
//       <ModalProduct />
//     </>
//   );
// };

// export default Products;

import React, { useState } from "react";
import { MDBCard, MDBBtn } from "mdbreact";

const categories = [
  { id: 1, name: "PPE & Safety", icon: "🧤" },
  { id: 2, name: "Consumables", icon: "💉" },
  { id: 3, name: "Medical Equipment", icon: "🛠️" },
  { id: 4, name: "Pharmacy", icon: "💊" },
  { id: 5, name: "Diagnostics", icon: "🩺" },
  { id: 6, name: "Surgical Tools", icon: "🔪" },
  { id: 7, name: "Furniture", icon: "🛏️" },
  { id: 8, name: "Laboratory", icon: "🧪" },
];

const ITEMS_PER_PAGE = 5;

const EcommerceLayout = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = categories.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < categories.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="h4 font-weight-bold mb-4">Hospital Supplies Categories</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <MDBBtn
          color="primary"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          Previous
        </MDBBtn>
        <MDBBtn
          color="primary"
          onClick={handleNext}
          disabled={endIndex >= categories.length}
        >
          Next
        </MDBBtn>
      </div>
      <div className="d-flex justify-content-center">
        {currentItems.map((category) => (
          <MDBCard
            key={category.id}
            className="p-3 text-center mx-2 hoverable"
            style={{ minWidth: "150px" }}
          >
            <div className="mb-2" style={{ fontSize: "2rem" }}>
              {category.icon}
            </div>
            <h5 className="font-weight-bold mb-2">{category.name}</h5>
          </MDBCard>
        ))}
      </div>
    </div>
  );
};

export default EcommerceLayout;
