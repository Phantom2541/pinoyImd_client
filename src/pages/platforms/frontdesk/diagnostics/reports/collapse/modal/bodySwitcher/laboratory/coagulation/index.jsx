import React from "react";
import { MDBCardBody, MDBRow } from "mdbreact";
// import { useSelector } from "react-redux";
// import { Protime, APTT } from "./containers";

const Coagulation = () => {
  // const { token, auth } = useSelector(({ auth }) => auth),
  // const { packages } = useSelector(({ task }) => task);
  // [pt, setPt] = useState([null, null]),
  // [aptt, setAptt] = useState([null, null]),
  // [verticalActive, setVerticalActive] = useState("tab1");

  // useEffect(() => {
  //   packages.includes(53) && setVerticalActive("tab1");
  //   packages.includes(54) && setVerticalActive("tab2");
  // }, [packages]);

  // const handleVerticalClick = (value) =>
  //   value === verticalActive ? "" : setVerticalActive(value);

  return (
    <MDBCardBody>
      <MDBRow>
        {/* {packages.length > 1 && (
          <MDBCol size="3">
            <MDBTabs className="flex-column text-center mb-2">
              <MDBBtn
                color="info"
                outline={verticalActive === "tab1"}
                onClick={() => handleVerticalClick("tab1")}
              >
                Protime
              </MDBBtn>
            </MDBTabs>
            <MDBTabs className="flex-column text-center">
              <MDBBtn
                color="secondary"
                outline={verticalActive === "tab2"}
                onClick={() => handleVerticalClick("tab2")}
              >
                APTT
              </MDBBtn>
            </MDBTabs>
          </MDBCol>
        )} */}
        {/* <MDBCol size={packages.length > 1 ? 9 : 12}>
          <MDBTabsContent>
            <MDBTabsPane show={verticalActive === "tab1"}>
              <h2 className="text-center">Protime</h2>
              <Protime pt={pt} setPt={setPt} />
            </MDBTabsPane>
            <MDBTabsPane show={verticalActive === "tab2"}>
              <h2 className="text-center">APTT</h2>
              <APTT aptt={aptt} setAptt={setAptt} />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol> */}
      </MDBRow>
    </MDBCardBody>
  );
};

export default Coagulation;
