import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";
import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../components/tableLoading";
import { HMO } from "../../../../services/fakeDb"; // make sure path is correct

// import Footer from "./footer";
// import Modal from "./modal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredHMOs, setFilteredHMOs] = useState(HMO.collections.slice(1)); // skip the first HMO item

  useEffect(() => {
    // Simulate loading time (replace with actual fetch if needed)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
          {/* Pass setter to Header */}
          <Header setFilteredHMOs={setFilteredHMOs} />

          <MDBCardBody>
            {isLoading ? (
              <TableLoading />
            ) : (
              <Body filteredHMOs={filteredHMOs} />
            )}
          </MDBCardBody>

          {/* <Footer /> */}
        </MDBCard>
      </MDBAnimation>

      {/* <Modal /> */}
    </>
  );
};

export default Index;
