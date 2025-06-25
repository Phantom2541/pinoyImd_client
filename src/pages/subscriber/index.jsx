import { useEffect, useState } from "react";
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
import Staffs from "./staff";
import LOGO from "./../../assets/iMD.png";
import Testimonials from "./testimonials";
import Machines from "./machine";
import { useDispatch, useSelector } from "react-redux";
import { GET_DETAILS } from "../../services/redux/slices/assets/companies";
import { ENDPOINT } from "../../services/utilities";
import Loading from "./loading";
import Doctors from "./doctor";

const Subscriber = ({ match }) => {
  const { details, isLoading } = useSelector(({ companies }) => companies),
    [show, setShow] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [flipped, setFlipped] = useState(false),
    [isSignUp, setIsSignUp] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [connectOpen, setConnectOpen] = useState(false),
    dispatch = useDispatch(),
    companyId = match?.params?.companyId;

  useEffect(() => {
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
              >
                {[
                  "home",
                  "machines",
                  "doctors",
                  "staffs",
                  "testimonials",
                  "contact",
                ].map((id) => (
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
                onClick={() => setMenuOpen(!menuOpen)}
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
                  onClick={() => setConnectOpen(!connectOpen)}
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
            <div id="machines">
              <Machines />
            </div>
            <hr className="mb-5" />
            <div id="doctors">
              <Doctors />
            </div>
            <hr className="mb-5" />
            <div id="testimonials">
              <Testimonials />
            </div>
            <hr className="mb-4" />
            <div id="staffs" className="mb-4">
              <Staffs />
            </div>
            <div id="contact" className="mt-5">
              <ContactUs />
              <Copyrights />
            </div>
          </MDBContainer>

          {/* <MDBFooter className="mt-5 text-center text-md-left">
            <MDBContainer>
              <MDBRow>
                <MDBCol md="12">
                  <ul className="list-unstyled d-flex justify-content-center mb-0 pb-0 pt-2 list-inline">
                    <li
                      className="list-inline-item cursor-pointer"
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/z3.star/",
                          "_blank"
                        )
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
          </MDBFooter> */}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Subscriber;
