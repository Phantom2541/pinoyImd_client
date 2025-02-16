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
    { activePortal, company, onDuty } = useSelector(({ auth }) => auth),
    [logo, setLogo] = useState(FailedLogo);

  useEffect(() => {
    if (company?.name && onDuty?.name) {
      const url = `${ENDPOINT}/public/credentials/${company.name}/${onDuty.name}/logo.png`;
      isImageValid(url, (valid) => {
        if (valid) setLogo(url);
      });
    }
  }, [company, onDuty]);

  useEffect(() => {
    if (activePortal) {
      setLinks(Sidebars[activePortal]);
    }
  }, [activePortal]);

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
        {activePortal && (
          <MDBSideNavNav>
            {links.map(({ path, name, icon, children }, index) => {
              if (children)
                return (
                  <MDBSideNavCat
                    id={`${name}-cat`}
                    name={capitalize(name)}
                    key={`sidebar-${index}-cat`}
                    icon={icon}
                  >
                    {children.map((child, cIndex) => (
                      <MDBSideNavLink
                        key={`sidebar-${index}-${cIndex}`}
                        to={`${path}${child.path}`}
                        onClick={onLinkClick}
                      >
                        {capitalize(child.name)}
                      </MDBSideNavLink>
                    ))}
                  </MDBSideNavCat>
                );

              return (
                <MDBSideNavLink
                  key={`sidebar-${index}`}
                  to={path}
                  topLevel
                  onClick={onLinkClick}
                >
                  <MDBIcon icon={`${icon} mr-2`} />
                  {capitalize(name)}
                </MDBSideNavLink>
              );
            })}
          </MDBSideNavNav>
        )}
      </MDBSideNav>
    </div>
  );
}
