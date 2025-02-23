import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBIcon } from "mdbreact";
import { connect } from "react-redux";
import Platforms from "./platforms";
import Profile from "./profile";
import Branches from "./branches";
import { capitalize } from "../../services/utilities";
import DTR from "./dtr";

class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleToggleClickA = this.handleToggleClickA.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  handleToggleClickA() {
    this.props.onSideNavToggleClick();
  }

  render() {
    const navStyle = {
      paddingLeft: this.props.toggle ? "16px" : "240px",
      transition: "padding-left .3s",
    };
    const { company, isPatient, platform } = this.props;

    return (
      <MDBNavbar
        className="flexible-MDBNavbar"
        light
        expand="md"
        scrolling
        fixed="top"
        style={{ zIndex: 3, minWidth: 500 }}
      >
        <div
          onClick={this.handleToggleClickA}
          key="sideNavToggleA"
          style={{
            lineHeight: "32px",
            marginleft: "1em",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        >
          <MDBIcon icon="bars" color="white" size="lg" />
        </div>

        <MDBNavbarBrand href="#" style={navStyle}>
          <strong>
            {isPatient
              ? "Welcome to Pinoy iMD"
              : `${capitalize(company?.name)} | ${capitalize(platform)}`}
          </strong>
        </MDBNavbarBrand>
        <MDBNavbarNav
          expand="sm"
          right
          style={{ flexDirection: "row", gap: "5px" }}
        >
          {!isPatient && (
            <>
              <DTR />
              <Branches />
              <Platforms />
            </>
          )}
          <Profile />
        </MDBNavbarNav>
      </MDBNavbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    company: state.auth.company,
    isPatient: state.auth.isPatient,
    platform: state.auth.activePlatform.platform,
  };
};

export default connect(mapStateToProps)(TopNavigation);
