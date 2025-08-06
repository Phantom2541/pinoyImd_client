import Header from "./header";
import Tab from "./tab";
import Footer from "./footer";
import Body from "./body.jsx";
import { useState } from "react";
import { MDBCard, MDBAnimation } from "mdbreact";

const CaseAdmissionForm = () => {
  const [activeTab, setActiveTab] = useState("patient");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
          <Body activeTab={activeTab} data={formData} onChange={handleChange} />
          <Footer onSubmit={() => alert("Patient & Admission saved!")} />
        </MDBCard>
      </MDBAnimation>
    </>
  );
};

export default CaseAdmissionForm;
