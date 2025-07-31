import { useEffect, useState, useRef } from "react";
import { MDBContainer, MDBMask, MDBView } from "mdbreact";
import "../style.css";
import Copyrights from "../../../components/footer";
import Register from "../../home/slideShow";
import ContactUs from "./contact";
import Login from "../../home/login";
import LOGO from "./../../../assets/iMD.png";
import Testimonials from "./testimonials";
import Machines from "./machine";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../services/utilities";
import Loading from "./loading";
import Doctors from "./doctor";
import Employees from "./employee";
import Partners from "./partners";
import Philhealth from "./philhealth";
import ECGWave from "./cardioGraph";
import MissionVision from "./missionVision";

const Diagnostics = ({ match }) => {
  const { details, isLoading } = useSelector(({ companies }) => companies),
    { hmo, hasPhilHealth } = details,
    [show, setShow] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [flipped, setFlipped] = useState(false),
    [isSignUp, setIsSignUp] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [connectOpen, setConnectOpen] = useState(false),
    [activeSection, setActiveSection] = useState("home"),
    [indicatorStyle, setIndicatorStyle] = useState({}),
    linkRefs = useRef({}),
    menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (window.scrollY === 0 && isSignUp) {
        setFlipped(true);
        setIsSignUp(false);
      }
      setScrolled(isScrolled);
    };
    if (isSignUp) {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSignUp]);

  useEffect(() => {
    const el = linkRefs.current[activeSection];
    if (el && menuRef.current) {
      const { offsetLeft, offsetWidth } = el;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeSection, menuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -110; // adjust this value based on your topbar height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const { name } = details;

  return (
    <>
      {!isLoading ? (
        <div id="subscriber-landing">
          <div className="subscriber-topbar">
            <div
              className={`subscriber-topbar-animation ${
                scrolled ? "scrolled" : ""
              }`}
            />
            <div className="subscriber-topbar-left">
              <div className={`subscriber-logo ${scrolled ? "scrolled" : ""}`}>
                <img
                  src={`${ENDPOINT}/public/companies/${name}/logo.png`}
                  alt="logo"
                  onError={(e) => (e.target.src = LOGO)}
                  className="mr-2"
                />
                {name}
              </div>
              <div
                className={`subscriber-menu ${
                  menuOpen ? "subscriber-open" : ""
                } ${scrolled ? "scrolled" : ""}`}
                ref={menuRef}
              >
                <div
                  // className="menu-indicator home-indicator"
                  className={`menu-indicator ${
                    scrolled ? "" : "home-indicator"
                  }`}
                  style={indicatorStyle}
                ></div>
                {[
                  "home",
                  "features",
                  "doctors",
                  "partners",
                  "employees",
                  "testimonials",
                  "contact",
                ].map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    ref={(el) => (linkRefs.current[id] = el)}
                    className={activeSection === id ? "active-menu" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                      setActiveSection(id);
                      setMenuOpen(false);
                    }}
                  >
                    {id.charAt(0).toUpperCase() +
                      id
                        .slice(1)
                        .replace("about", "Features")
                        .replace("contact", "Contact Us")}
                  </a>
                ))}
              </div>
            </div>

            <div className="subscriber-topbar-right">
              <div className="subscriber-desktop-buttons">
                <button
                  className={`subscriber-btn-login ${
                    scrolled ? "scrolled" : ""
                  }`}
                  onClick={() => setShow(!show)}
                >
                  Login
                </button>
                <button
                  className={`subscriber-btn-signup ${
                    scrolled ? "scrolled" : ""
                  } ${flipped ? "active" : ""}`}
                  onClick={() => {
                    setIsSignUp(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Sign Up
                </button>
              </div>

              <div
                className={`subscriber-hamburger ${
                  menuOpen ? "subscriber-active" : ""
                }`}
                onClick={() => {
                  setConnectOpen(false);
                  setMenuOpen(!menuOpen);
                }}
              >
                <div
                  className={`subscriber-bar ${scrolled ? "scrolled" : ""}`}
                />
                <div
                  className={`subscriber-bar ${scrolled ? "scrolled" : ""}`}
                />
                <div
                  className={`subscriber-bar ${scrolled ? "scrolled" : ""}`}
                />
              </div>

              <div className="subscriber-mobile-connect">
                <button
                  className={`subscriber-btn-connect ${
                    connectOpen ? "activeConnect" : ""
                  } ${scrolled ? "scrolled" : ""}`}
                  onClick={() => {
                    setConnectOpen(!connectOpen);
                    setMenuOpen(false);
                  }}
                >
                  Connect ▾
                </button>
                <div
                  className={`subscriber-connect-dropdown ${
                    connectOpen ? "activeConnect" : ""
                  }`}
                >
                  <button
                    className="subscriber-btn-login-dropdown"
                    onClick={() => setShow(!show)}
                  >
                    Login
                  </button>
                  <button
                    className="subscriber-btn-signup-dropdown"
                    onClick={() => setFlipped(!flipped)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`subscriber-overlay ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          />

          <section id="home">
            <Login show={show} toggle={() => setShow(!show)} />
            <MDBView className={`${!flipped || "flipped"}`}>
              <MDBMask
                className="d-flex justify-content-center align-items-center"
                overlay="gradient"
              >
                <div className="subscriber-container" id="home">
                  <Register
                    handleFlip={() => setFlipped(!flipped)}
                    flipped={flipped}
                  />
                </div>
              </MDBMask>
            </MDBView>
          </section>

          <MDBContainer fluid className="p-0">
            <div id="features">
              <Machines />
            </div>
            <ECGWave color="#1266f1" waves={20} className="my-4" />

            <div id="doctors">
              <Doctors />
            </div>

            <div id="doctors" className="my-5">
              <MissionVision />
            </div>

            {hmo?.length > 0 && (
              <div id="partners">
                <Partners />
              </div>
            )}
            {hasPhilHealth && (
              <div id="testimonials">
                <Philhealth />
              </div>
            )}

            <ECGWave color="#1266f1" waves={19} className="my-4" />
            <div id="testimonials">
              <Testimonials />
            </div>
            <ECGWave color="#1266f1" waves={25} className="my-4" />
            <div id="employees">
              <Employees match={match} />
            </div>
            <div id="contact">
              <ContactUs />
              <Copyrights />
            </div>
          </MDBContainer>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Diagnostics;
