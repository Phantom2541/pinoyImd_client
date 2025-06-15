import React, { Component } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBBadge,
} from "mdbreact";
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
    const { isPatient, department, aka } = this.props;
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
          <MDBBadge
            className="py-2 px-3"
            color="warning-color-dark"
            style={{
              fontSize: "1rem",
              fontWeight: 400,
              boxShadow: "0px 0px 0px 0px",
            }}
            pill
          >
            {isPatient
              ? "Welcome to Pinoy iMD"
              : `${capitalize(department)} :) ${capitalize(aka)}`}
          </MDBBadge>
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
            </>
          )}
          <Platforms />
          <Profile />
        </MDBNavbarNav>
      </MDBNavbar>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    isPatient: auth.auth.isPatient,
    aka: auth.auth.alias || auth.auth.fullName?.fname,
    department: auth.activePlatform?.department,
  };
};

export default connect(mapStateToProps)(TopNavigation);
