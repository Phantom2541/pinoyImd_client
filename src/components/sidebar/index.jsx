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
  const [links, setLinks] = useState([]),
    { activePlatform, company, isLoading } = useSelector(({ auth }) => auth),
    [logo, setLogo] = useState(FailedLogo),
    [activeCategory, setActiveCategory] = useState(""); //for multiple children sidebar
  useEffect(() => {
    if (company?.name && activePlatform?.platform) {
      /**
       *  display company logo
       *  if logo is not found, display default
       *  @y'dreo
       */
      const url = `${ENDPOINT}/public/credentials/${company.name}/${activePlatform.platform}/logo.png`;
      isImageValid(url, (valid) => {
        if (valid) setLogo(url);
      });
    }
  }, [company, activePlatform]);

  useEffect(() => {
    if (activePlatform?.platform) {
      const { platform } = activePlatform;
      setLinks(Sidebars[platform?.toLowerCase()] || []);
    }
  }, [activePlatform, setLinks]);

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
        >
          <MDBIcon icon={item.icon} className="mr-2" />
          {capitalize(item.name)}
        </MDBSideNavLink>
      );
    });
  };

  return (
    <div className="white-skin">
      <MDBSideNav
        logo={logo}
        bg="https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg"
        mask="strong"
        href={`/${activePlatform.platform}/${
          activePlatform.platform === "manager" ? "dashboard" : "bulletin"
        }`}
        fixed
        breakWidth={breakWidth}
        triggerOpening={triggerOpening}
        style={{ transition: "padding-left .3s" }}
      >
        {!isLoading ? (
          <>
            {activePlatform && (
              <MDBSideNavNav>
                {renderNavItems(
                  links,
                  "sidebar",
                  `/${activePlatform.platform?.toLowerCase() || ""}`
                )}
              </MDBSideNavNav>
            )}
          </>
        ) : (
          <>
            {new Array(6).fill().map((_, index) => (
              <div className="mx-2">
                <MDBAnimation
                  key={index}
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
                    className="mr-2"
                    value={3000}
                  ></MDBProgress>
                  <MDBProgress
                    animated
                    id={`sidebar-loading-${index + 1}`}
                    color="light"
                    value={3000}
                  ></MDBProgress>
                </MDBAnimation>
              </div>
            ))}
          </>
        )}
      </MDBSideNav>
      <button>tes</button>
    </div>
  );
}
