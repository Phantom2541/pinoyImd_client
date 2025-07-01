import { useEffect, useState, useRef } from "react";
import { MDBContainer, MDBMask, MDBView } from "mdbreact";
import "./style.css";
import Copyrights from "../../components/footer";
import Register from "./register";
import ContactUs from "./contact";
import Login from "./login";
import LOGO from "./../../assets/iMD.png";
import Testimonials from "./testimonials";
import Machines from "./machine";
import { useDispatch, useSelector } from "react-redux";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";
import { ENDPOINT } from "../../services/utilities";
import Loading from "./loading";
import Doctors from "./doctor";
import Employees from "./employee";
import Partners from "./partners";

const Subscriber = ({ match }) => {
  const { details, isLoading } = useSelector(({ companies }) => companies),
    { hmo } = details,
    [show, setShow] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [flipped, setFlipped] = useState(false),
    [isSignUp, setIsSignUp] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [connectOpen, setConnectOpen] = useState(false),
    [activeSection, setActiveSection] = useState("home"),
    [indicatorStyle, setIndicatorStyle] = useState({}),
    dispatch = useDispatch(),
    linkRefs = useRef({}),
    menuRef = useRef(null),
    companyId = match?.params?.companyId;

  useEffect(() => {
    localStorage.setItem("companyId", companyId);
    dispatch(GET_DETAILS({ key: { companyId } }));
  }, [companyId, dispatch]);

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
                  }`}
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
            <MDBView>
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
            <hr className="mb-5" />

            <div id="doctors">
              <Doctors />
            </div>
            <hr className="mb-5" />
            {hmo.length > 0 && (
              <div id="partners">
                <Partners />
              </div>
            )}
            <hr className="mb-5" />
            <div id="testimonials">
              <Testimonials />
            </div>
            <hr className="mb-5" />
            <div id="employees">
              <Employees match={match} />
            </div>
            <div id="contact" className="mt-5">
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

export default Subscriber;
