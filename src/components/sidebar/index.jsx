import React, { useState, useEffect } from "react";
import {
  MDBSideNavLink,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav,
  MDBIcon,
  MDBBtn,
} from "mdbreact";
import { useSelector } from "react-redux";
import { Sidebars } from "../../services/fakeDb";
import {
  ENDPOINT,
  FailedLogo,
  capitalize,
  isImageValid,
} from "../../services/utilities";

export default function SideNavigation({
  triggerOpening,
  breakWidth,
  onLinkClick,
}) {
  const [links, setLinks] = useState([]),
    { activePlatform, company } = useSelector(({ auth }) => auth),
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
    if (activePlatform) {
      setLinks(Sidebars[activePlatform.platform] || []);
    }
  }, [activePlatform]);

  const renderNavItems = (
    items,
    keyPrefix = "",
    basePath = "",
    level = 1.5
  ) => {
    return items.map((item, index) => {
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
        href="/dashboard"
        fixed
        breakWidth={breakWidth}
        triggerOpening={triggerOpening}
        style={{ transition: "padding-left .3s" }}
      >
        {activePlatform && (
          <MDBSideNavNav>{renderNavItems(links, "sidebar")}</MDBSideNavNav>
        )}
      </MDBSideNav>
      <button>tes</button>
    </div>
  );
}
