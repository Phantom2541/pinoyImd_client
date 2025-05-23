import React, { useState, useEffect } from "react";
import {
  MDBSideNavLink,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav,
  MDBAnimation,
  MDBProgress,
  MDBIcon,
} from "mdbreact";
import { useSelector } from "react-redux";
import { Sidebars } from "../../services/fakeDb";
import {
  ENDPOINT,
  FailedLogo,
  capitalize,
  isImageValid,
} from "../../services/utilities";
import "./style.css";

export default function SideNavigation({
  triggerOpening,
  breakWidth,
  onLinkClick,
}) {
  const [links, setLinks] = useState([]);
  const { activePlatform, company, isLoading } = useSelector(
      ({ auth }) => auth
    ),
    [logo, setLogo] = useState(FailedLogo),
    [href, setHref] = useState(""),
    [activeCategory, setActiveCategory] = useState("");

  // Load company logo if available
  useEffect(() => {
    if (company?.name && activePlatform?.platform && !isLoading) {
      const url = `${ENDPOINT}/public/companies/${
        company.name
      }/logo.png?${new Date().getTime()}`;
      isImageValid(url, (valid) => {
        if (valid) setLogo(url);
      });

      const _href = `/${activePlatform?.platform.toLowerCase() || "patron"}/${
        ["manager", "headquarter"].includes(
          activePlatform?.platform.toLowerCase()
        )
          ? "dashboard"
          : "bulletin"
      }`;
      setHref(_href);
    }
  }, [company, activePlatform, isLoading]);

  // Load sidebar links
  useEffect(() => {
    if (activePlatform?.platform) {
      const platformKey = activePlatform?.platform
        ?.toLowerCase()
        .replace(/\s/g, "");
      setLinks(Sidebars[platformKey] || []);
    } else {
      setLinks(Sidebars["patron"] || []);
    }
  }, [activePlatform]);

  const renderNavItems = (
    _links,
    keyPrefix = "",
    basePath = "",
    level = 1.5
  ) => {
    return _links.map((item, index) => {
      const key = `${keyPrefix}-${index}`;
      const fullPath = `${basePath}${item.path || ""}`;
      const isOpen = activeCategory === key;
      const indentStyle = { paddingLeft: `${level * 15}px` };

      if (item.children && item.children.length > 0) {
        return (
          <MDBSideNavCat
            id={`${key}-cat`}
            name={capitalize(item.name)}
            key={`${key}-cat`}
            icon={item.icon}
            isOpen={isOpen}
            onClick={() =>
              setActiveCategory((prev) => (prev === key ? "" : key))
            }
            style={indentStyle}
          >
            {renderNavItems(item.children, key, fullPath, level + 1)}
          </MDBSideNavCat>
        );
      }

      return (
        <MDBSideNavLink
          key={key}
          to={fullPath}
          topLevel
          onClick={onLinkClick}
          style={indentStyle}
          title={item.title} // ← DITO LANG NILAGAY ANG TOOLTIP
        >
          <MDBIcon icon={item.icon} className="mr-2" />
          {capitalize(item.name)}
        </MDBSideNavLink>
      );
    });
  };

  return (
    <div className="white-skin no-print">
      <MDBSideNav
        // logo={logo}
        tag="div"
        bg="https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg"
        alt="Company Logo"
        mask="strong"
        href={href}
        fixed
        breakWidth={breakWidth}
        triggerOpening={triggerOpening}
        style={{ transition: "padding-left .3s" }}
      >
        {/* ✅ Custom Header with Logo + Dynamic Title */}
        <div className="text-center mt-2 " style={{ marginBottom: "-10px" }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "150px", height: "65px" }}
          />
          <div className="mt-2 text-dark" style={{ fontWeight: 500 }}>
            {activePlatform?.branch?.company || company?.name}
          </div>
        </div>
        <hr />
        <MDBSideNavNav>
          {!isLoading
            ? renderNavItems(
                links,
                "sidebar",
                `/${activePlatform?.platform?.toLowerCase() || "patron"}`
              )
            : new Array(6).fill().map((_, index) => (
                <div className="mx-2" key={index}>
                  <MDBAnimation
                    type="flash"
                    infinite
                    className="mt-3 d-flex align-items-center"
                    delay={`${index + 1}00ms`}
                    duration="3000ms"
                  >
                    <MDBProgress
                      animated
                      id={`sidebar-loading-icon`}
                      color="light"
                      className="mr-2 ml-2"
                      value={3000}
                    ></MDBProgress>
                    <MDBProgress
                      animated
                      className="mr-2"
                      id={`sidebar-loading-${index + 1}`}
                      color="light"
                      value={3000}
                    ></MDBProgress>
                  </MDBAnimation>
                </div>
              ))}
        </MDBSideNavNav>
      </MDBSideNav>
      <button>tes</button>
    </div>
  );
}
