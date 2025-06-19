import React from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavItem,
  MDBRow,
  MDBCol,
  MDBMask,
  MDBIcon,
  MDBView,
  MDBFooter,
  MDBNavLink,
} from "mdbreact";
import "./index.css";
import Copyrights from "../../components/footer";
import Register from "./register";
import ContactUs from "./contact";
import Login from "./login";
import Description from "./description";
import Pioneers from "./pioneers";
import LOGO from "./../../assets/iMD.png";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      show: false,
      scrolled: false,
      flipped: false,
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

  render() {
    return (
      <div id="landing">
        <div className="frontPage-topBar d-flex justify-content-between align-items-center">
          <div
            className={`frontPage-topBar-animation ${
              this.state.scrolled ? "scrolled" : ""
            }`}
          ></div>
          <div className="d-flex" style={{ gap: "120px" }}>
            <div className="d-flex align-items-center" style={{ gap: "3px" }}>
              <img src={LOGO} alt="Logo" width="45px" className="logoImg" />
              <span
                className={`logo-imd ${this.state.scrolled ? "scrolled" : ""}`}
              >
                Pinoy iMD
              </span>
            </div>
            <div className={`menu ${this.state.scrolled ? "scrolled" : ""}`}>
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
                Pricing
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  this.scrollToSection("contact");
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
          <div className="d-flex" style={{ gap: "20px" }}>
            <button
              className={`frontPage-login ${
                this.state.scrolled ? "scrolled" : ""
              }`}
              onClick={this.toggle}
            >
              Login
            </button>
            <button
              className={`frontPage-signup ${
                this.state.scrolled ? "scrolled" : ""
              }`}
              onClick={this.handleFlip}
            >
              Sign Up
            </button>
          </div>
        </div>
        {/* <MDBNavbar dark expand="md" scrolling transparent>
          <MDBContainer>
            <MDBNavbarBrand>
              <strong className="white-text">Pinoy IMD</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse("navbarCollapse")} />
            <MDBCollapse
              id="navbarCollapse"
              isOpen={this.state.collapseID}
              navbar
            >
              <MDBNavbarNav right> */}
        {/* <MDBNavItem>
                  <MDBNavLink to="/FAQ">FAQ</MDBNavLink>
                </MDBNavItem> */}
        {/* <MDBNavItem>
                  <MDBNavLink onClick={this.toggle} to="#">
                    Login
                  </MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar> */}

        <section id="home">
          <Login show={this.state.show} toggle={this.toggle} />
          <MDBView>
            <MDBMask
              className="d-flex justify-content-center align-items-center"
              overlay="gradient"
            >
              <MDBContainer
                id="home"
                fluid
                style={{
                  padding: "0 300px",
                }}
              >
                <Register
                  handleFlip={this.handleFlip}
                  flipped={this.state.flipped}
                />
              </MDBContainer>
            </MDBMask>
          </MDBView>
        </section>
        <MDBContainer fluid style={{ padding: "0 180px" }}>
          <div id="about">
            <Description />
          </div>
          <hr className="mb-5" />

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
  }
}
