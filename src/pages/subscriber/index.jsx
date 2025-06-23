import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBMask,
  MDBIcon,
  MDBView,
  MDBFooter,
} from "mdbreact";
import "./style.css";
import Copyrights from "../../components/footer";
import Register from "./register";
import ContactUs from "./contact";
import Login from "./login";
import Pioneers from "./pioneers";
import LOGO from "./../../assets/iMD.png";
import Testimonials from "./testimonials";
import AboutUs from "./aboutUs";
import Affliated from "./affliated";
import { useDispatch, useSelector } from "react-redux";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";
import { ENDPOINT } from "../../services/utilities";
import Loading from "./loading";

const Subscriber = ({ match }) => {
  const { details } = useSelector(({ companies }) => companies),
    [show, setShow] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [flipped, setFlipped] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [connectOpen, setConnectOpen] = useState(false),
    dispatch = useDispatch(),
    companyId = match?.params?.companyId;

  useEffect(() => {
    dispatch(GET_DETAILS({ key: { companyId } }));
  }, [companyId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { name } = details;

  return (
    <div id="landing">
      <div className="homePage-topbar">
        <div
          className={`homePage-topbar-animation ${scrolled ? "scrolled" : ""}`}
        />
        <div className="homePage-topbar-left">
          <div className={`homePage-logo ${scrolled ? "scrolled" : ""}`}>
            <img
              src={`${ENDPOINT}/public/companies/${name}/logo.png`}
              alt="logo"
              onError={(e) => (e.target.src = LOGO)}
              className="mr-2"
            />
            {name}
          </div>
          <div
            className={`homePage-menu ${menuOpen ? "homePage-open" : ""} ${
              scrolled ? "scrolled" : ""
            }`}
          >
            {["home", "about", "pioneers", "testimonials", "contact"].map(
              (id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                >
                  {id.charAt(0).toUpperCase() +
                    id
                      .slice(1)
                      .replace("about", "Features")
                      .replace("contact", "Contact Us")}
                </a>
              )
            )}
          </div>
        </div>

        <div className="homePage-topbar-right">
          <div className="homePage-desktop-buttons">
            <button
              className={`homePage-btn-login ${scrolled ? "scrolled" : ""}`}
              onClick={() => setShow(!show)}
            >
              Login
            </button>
            <button
              className={`homePage-btn-signup ${scrolled ? "scrolled" : ""}`}
              onClick={() => setFlipped(!flipped)}
            >
              Sign Up
            </button>
          </div>

          <div
            className={`homePage-hamburger ${
              menuOpen ? "homePage-active" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`homePage-bar ${scrolled ? "scrolled" : ""}`} />
            <div className={`homePage-bar ${scrolled ? "scrolled" : ""}`} />
            <div className={`homePage-bar ${scrolled ? "scrolled" : ""}`} />
          </div>

          <div className="homePage-mobile-connect">
            <button
              className={`homePage-btn-connect ${
                connectOpen ? "activeConnect" : ""
              } ${scrolled ? "scrolled" : ""}`}
              onClick={() => setConnectOpen(!connectOpen)}
            >
              Connect ▾
            </button>
            <div
              className={`homePage-connect-dropdown ${
                connectOpen ? "activeConnect" : ""
              }`}
            >
              <button
                className="homePage-btn-login-dropdown"
                onClick={() => setShow(!show)}
              >
                Login
              </button>
              <button
                className="homePage-btn-signup-dropdown"
                onClick={() => setFlipped(!flipped)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`homePage-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <section id="home">
        <Login show={show} toggle={() => setShow(!show)} />
        <MDBView>
          <MDBMask
            className="d-flex justify-content-center align-items-center"
            overlay="gradient"
          >
            <div className="homePage-container" id="home">
              <Register
                handleFlip={() => setFlipped(!flipped)}
                flipped={flipped}
              />
            </div>
          </MDBMask>
        </MDBView>
      </section>

      <MDBContainer fluid>
        <div id="about">
          <AboutUs />
        </div>
        <hr className="mb-5" />
        <div id="about">
          <Affliated />
        </div>
        <hr className="mb-5" />
        <div id="testimonials">
          <Testimonials />
        </div>
        <hr className="mb-4" />
        <div id="pioneers">
          <Pioneers />
        </div>
        <hr className="mb-4" />
        <div id="contact">
          <ContactUs />
        </div>
      </MDBContainer>

      <MDBFooter className="mt-5 text-center text-md-left">
        <MDBContainer>
          <MDBRow>
            <MDBCol md="12">
              <ul className="list-unstyled d-flex justify-content-center mb-0 pb-0 pt-2 list-inline">
                <li
                  className="list-inline-item cursor-pointer"
                  onClick={() =>
                    window.open("https://www.facebook.com/z3.star/", "_blank")
                  }
                >
                  <MDBIcon
                    fab
                    icon="facebook"
                    size="2x"
                    className="white-text p-2 m-2"
                  />
                </li>
                <li
                  className="list-inline-item cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/benedict-pajarillaga-98b864222/",
                      "_blank"
                    )
                  }
                >
                  <MDBIcon
                    fab
                    icon="linkedin"
                    size="2x"
                    className="white-text p-2 m-2"
                  />
                </li>
              </ul>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <Copyrights />
      </MDBFooter>
    </div>
  );
};

export default Subscriber;
