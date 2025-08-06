import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import TableLoading from "../../../../../components/tableLoading";
import Body from "./body";
import Modal from "./modal";
import ModalTeams from "./collapse/modal";

const Index = () => {
  const { isLoading } = useSelector(({ quest }) => quest);
  const [isBodyReady, setIsBodyReady] = useState(false);

  // Optional: Delay load body for animation purposes (or after header mount)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBodyReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex">
      {/* Left Panel: Card with Header + Footer */}
      {/* <div style={{ width: "300px", minHeight: "600px" }}>
        <MDBAnimation type="bounceInDown">
          <MDBCard narrow className="pb-3 h-100">
            <Header />
            <Footer />
          </MDBCard>
        </MDBAnimation>
      </div> */}

      {/* Right Panel: Body */}
      <div className="flex-grow-1 ml-3">
        {isLoading ? <TableLoading /> : isBodyReady && <Body />}
      </div>

      {/* Modals */}
      <Modal />
      <ModalTeams />
    </div>
  );
};

export default Index;
