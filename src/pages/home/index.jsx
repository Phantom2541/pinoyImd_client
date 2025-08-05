import React from "react";
import {
  MDBContainer,
  // MDBNavbar,
  // MDBNavbarBrand,
  // MDBNavbarToggler,
  // MDBCollapse,
  // MDBNavbarNav,
  // MDBNavItem,
  MDBRow,
  MDBCol,
  MDBMask,
  MDBIcon,
  MDBView,
  MDBFooter,
  // MDBNavLink,
} from "mdbreact";
import "./style.css";
import Copyrights from "../../components/footer";
import ContactUs from "./contact";
import Login from "./login";
import Description from "./description";
import Pioneers from "./pioneers";
import LOGO from "./../../assets/iMD.png";
import Testimonials from "./testimonials";
import AboutUs from "./aboutUs";
import Affliated from "./affliated";
import Gallery from "./gallery";
import SlideShow from "./slideShow";
import { Helmet } from "react-helmet";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      show: false,
      scrolled: false,
      flipped: false,
      menuOpen: false,
      buttonOpen: false,
      connectOpen: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const isScrolled = window.scrollY > 50;
    if (isScrolled !== this.state.scrolled) {
      this.setState({ scrolled: isScrolled });
    }
  };

  scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  handleFlip = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  toggle = () => this.setState({ show: !this.state.show });

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));

  toggleMenu = () => {
    this.setState((prevState) => ({
      menuOpen: !prevState.menuOpen,
    }));
  };

  toggleButtons = () => {
    this.setState((prevState) => ({ buttonOpen: !prevState.buttonOpen }));
  };

  toggleConnect = () => {
    this.setState((prevState) => ({
      connectOpen: !prevState.connectOpen,
    }));
  };

  render() {
    return (
      <div id="landing">
        <Helmet>
          <title>
            Pinoy iMD - Filipino EHR, HIMS & Medical Diagnostics Software
          </title>
          <meta
            name="description"
            content="Pinoy iMD is a Filipino-developed EHR, LIS, and clinic management system designed for diagnostic laboratories, mobile clinics, and healthcare providers in the Philippines."
          />
          <meta
            name="keywords"
            content="EHR Philippines, LIS software, Filipino clinic system, medical diagnostics, hospital information management system, Pinoy iMD, DOH compliant LIS"
          />
          <meta name="robots" content="index, follow" />
          <meta
            name="google-site-verification"
            content="google8a375c824ecf58f7"
          />
        </Helmet>

        <div className="homePage-topbar">
          <div
            className={`homePage-topbar-animation ${
              this.state.scrolled ? "scrolled" : ""
            }`}
          ></div>
          <div className="homePage-topbar-left">
            <div
              className={`homePage-logo ${
                this.state.scrolled ? "scrolled" : ""
              }`}
            >
              <img src={LOGO} alt="logo" />
              Pinoy iMD
            </div>
            <div
              className={`homePage-menu ${
                this.state.menuOpen ? "homePage-open" : ""
              } ${this.state.scrolled ? "scrolled" : ""}`}
            >
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("home");
                }}
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("about");
                }}
              >
                Features
              </a>
              <a
                href="#pioneers"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("pioneers");
                }}
              >
                Pioneers
              </a>
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("testimonials");
                }}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("contact");
                }}
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="homePage-topbar-right">
            {/* Desktop Buttons */}
            <div className="homePage-desktop-buttons">
              <button
                className={`homePage-btn-login ${
                  this.state.scrolled ? "scrolled" : ""
                }`}
                onClick={this.toggle}
              >
                Login
              </button>
              <button
                className={`homePage-btn-signup ${
                  this.state.scrolled ? "scrolled" : ""
                }`}
                onClick={this.handleFlip}
              >
                Sign Up
              </button>
            </div>

            {/* Hamburger for mobile */}
            <div
              className={`homePage-hamburger  ${
                this.state.menuOpen ? "homePage-active" : ""
              }`}
              onClick={this.toggleMenu}
            >
              <div
                className={`homePage-bar ${
                  this.state.scrolled ? "scrolled" : ""
                }`}
              ></div>
              <div
                className={`homePage-bar ${
                  this.state.scrolled ? "scrolled" : ""
                }`}
              ></div>
              <div
                className={`homePage-bar ${
                  this.state.scrolled ? "scrolled" : ""
                }`}
              ></div>
            </div>

            {/* Mobile Connect Button */}
            <div className="homePage-mobile-connect">
              <button
                className={`homePage-btn-connect ${
                  this.state.connectOpen ? "activeConnect" : ""
                } ${this.state.scrolled ? "scrolled" : ""}`}
                onClick={this.toggleConnect}
              >
                Connect ▾
              </button>

              <div
                className={`homePage-connect-dropdown ${
                  this.state.connectOpen ? "activeConnect" : ""
                }`}
              >
                <button
                  className="homePage-btn-login-dropdown"
                  onClick={this.toggle}
                >
                  Login
                </button>
                <button
                  className="homePage-btn-signup-dropdown"
                  onClick={this.handleFlip}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`homePage-overlay ${this.state.menuOpen ? "active" : ""}`}
          onClick={() => {
            this.setState({ menuOpen: false });
          }}
        ></div>

        <section id="home">
          <Login show={this.state.show} toggle={this.toggle} />
          <MDBView>
            <MDBMask
              className="d-flex justify-content-center align-items-center"
              overlay="gradient"
            >
              <div className="homePage-container" id="home">
                <SlideShow
                  handleFlip={this.handleFlip}
                  flipped={this.state.flipped}
                />
              </div>
            </MDBMask>
          </MDBView>
        </section>
        <MDBContainer fluid>
          <div id="about">
            <Description />
          </div>
          <hr className="mb-5" />
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
          <div id="pioneers">
            <Gallery />
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
                  {/* <li
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
                  </li> */}
                </ul>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <Copyrights />
        </MDBFooter>
      </div>
    );
  }
}
