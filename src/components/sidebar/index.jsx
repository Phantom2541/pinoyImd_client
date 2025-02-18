import React, { useState, useEffect } from "react";
import {
  MDBSideNavLink,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav,
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

export default function SideNavigation({
  triggerOpening,
  breakWidth,
  onLinkClick,
}) {
  const [links, setLinks] = useState([]),
    { activePlatform, company, auth } = useSelector(({ auth }) => auth),
    [logo, setLogo] = useState(FailedLogo);

  useEffect(() => {
    if (company?.name && activePlatform?.name) {
      const url = `${ENDPOINT}/public/credentials/${company.name}/${activePlatform.name}/logo.png`;
      isImageValid(url, (valid) => {
        if (valid) setLogo(url);
      });
    }
  }, [company, activePlatform]);

  useEffect(() => {
    if (activePlatform) {
      setLinks(Sidebars[activePlatform] || []);
    }
  }, [activePlatform, auth]);

  // Recursive function to render nav items (both links and categories)
  const renderNavItems = (items, keyPrefix = "", basePath = "") => {
    return items.map((item, index) => {
      const key = `${keyPrefix}-${index}`;
      if (item.children && item.children.length > 0) {
        return (
          <MDBSideNavCat
            id={`${item.name}-cat`}
            name={capitalize(item.name)}
            key={`${key}-cat`}
            icon={item.icon}
          >
            {renderNavItems(item.children, key, `${basePath}${item.path}`)}{" "}
            {item.name}
          </MDBSideNavCat>
        );
      }
      return (
        <MDBSideNavLink
          key={key}
          to={`${basePath}${item.path}`}
          topLevel
          onClick={onLinkClick}
        >
          <MDBIcon icon={`${item.icon} mr-2`} />
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

          // <MDBSideNavNav>
          //   {links.map(({ path, name, icon, children }, index) =>
          //     children && children.length ? (
          //       <MDBSideNavCat
          //         id={`${name}-cat`}
          //         name={capitalize(name)}
          //         key={`sidebar-${index}-cat`}
          //         icon={icon}
          //       >
          //         {children.map((child, cIndex) => (
          //           <MDBSideNavLink
          //             key={`sidebar-${index}-${cIndex}`}
          //             to={`${path}${child.path}`}
          //             onClick={onLinkClick}
          //           >
          //             {capitalize(child.name)}
          //           </MDBSideNavLink>
          //         ))}
          //       </MDBSideNavCat>
          //     ) : (
          //       <MDBSideNavLink
          //         key={`sidebar-${index}`}
          //         to={path}
          //         topLevel
          //         onClick={onLinkClick}
          //       >
          //         <MDBIcon icon={`${icon} mr-2`} />
          //         {capitalize(name)}
          //       </MDBSideNavLink>
          //     )
          //   )}
          // </MDBSideNavNav>
        )}
      </MDBSideNav>
    </div>
  );
}
