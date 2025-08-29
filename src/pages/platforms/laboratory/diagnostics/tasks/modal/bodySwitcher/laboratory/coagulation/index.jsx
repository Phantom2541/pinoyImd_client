import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBCardBody, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import { Protime, APTT } from "./containers";

@ric darrel

const Coagulation = () => {
  const packages = useSelector(
    ({ validator }) => validator.task?.packages || []
  );
  const [pt, setPt] = useState([null, null]);
  const [aptt, setAptt] = useState([null, null]);
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    packages.includes(53) && setActiveTab("tab1");
    packages.includes(54) && setActiveTab("tab2");
  }, [packages]);

  return (
    <MDBCardBody>
      <MDBRow>
        {packages.length > 1 && (
          <MDBCol size="3" className="mb-2">
            <MDBBtn
              color="info"
              outline={activeTab === "tab1"}
              block
              onClick={() => setActiveTab("tab1")}
            >
              Protime
            </MDBBtn>
            <MDBBtn
              color="secondary"
              outline={activeTab === "tab2"}
              block
              onClick={() => setActiveTab("tab2")}
            >
              APTT
            </MDBBtn>
          </MDBCol>
        )}
        <MDBCol size={packages.length > 1 ? 9 : 12}>
          {activeTab === "tab1" && (
            <Protime pt={pt} setPt={setPt} aptt={aptt} setAptt={setAptt} />
          )}
          {/* {activeTab === "tab2" && (
            <APTT pt={pt} setPt={setPt} aptt={aptt} setAptt={setAptt} />
          )} */}
        </MDBCol>
      </MDBRow>
    </MDBCardBody>
  );
};

export default Coagulation;
