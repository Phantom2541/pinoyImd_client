import {MDBCard,MDBCardBody,MDBCol,MDBRow,MDBView } from "mdbreact";
import { useState } from "react";
const Index = () => {

  const [toggleValue, setToggleValue] = useState(false);  

  //plain boolean value not from IsAcreddited 
  function ToggleSwitch({ isToggled, setIsToggled }) {
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{minWidth: "20px", marginBottom:"8px", textAlign: "right" }}>False</span>
        {/* custom toggle switch */}
        <label style={{
          position: "relative",
          display: "inline-block",
          width: "40px",
          height: "21px",
          verticalAlign: "middle"
        }}>
          <input
            type="checkbox"
            checked={isToggled}
            onChange={() => setIsToggled(!isToggled)}
            style={{
              opacity: 0,
              width: 0,
              height: 0,
              margin: 0,
              padding: 0
            }}
          />
          <span style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isToggled ? "#05e30c" : "#4a4a4a",
            borderRadius: "34px",
            transition: "0.4s"
          }}>
            <span style={{
              position: "absolute",
              height: "15px",
              width: "15px",
              left: isToggled ? "22px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              transition: "0.4s",
              borderRadius: "50%"
            }} />
          </span>
        </label>
  
        <span style={{ minWidth: "20px", marginBottom:"8px"}}>True</span>
      </div>
    );
  }



  return (
    <div style={{ width: "800px" }} className="mx-auto">
      <MDBCard>
        <MDBCardBody >
          <MDBView className="text-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/11/Www.philhealth.gov.ph.png"
              alt="Philelhealth.png"
              style={{ height: "150px", width: "100%", paddingLeft:"20%",paddingRight:"20%" }}
            />
            <h5><b>Accreditation</b></h5>
          </MDBView>

          
          <div style={{ display: "flex",justifyContent: "center", gap: "8px" }}>
            
            <ToggleSwitch
              isToggled={toggleValue}
              setIsToggled={setToggleValue}
            />  
          </div>

        
          {toggleValue && (
          
          
          <MDBRow className="my-2" style={{ width: "100%", paddingLeft:"20%" }}>
            <MDBCol md="6">
              <h6><b>Accreditation Number</b> : 0988224001</h6>
              <h6><b>Validity</b></h6>
              <h6><b>Start</b>: 09/23/25</h6>
              <h6><b>End</b>: 03/14/29</h6>
              <h6><b>Remarks</b>: N/A</h6>
            </MDBCol>
            <MDBCol md="6">
              <h6 className="text-md-end">
                {/* Optional right-aligned content */}
              </h6>
            </MDBCol>
          </MDBRow>
          )}
          
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Index;
