import React, { useState, useEffect, useCallback } from "react";
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
  const [logo, setLogo] = useState(FailedLogo);
  const [href, setHref] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const { activePlatform, company, isLoading } = useSelector(
    ({ auth }) => auth
  );

  // 🔧 Utility: Filter sidebar by role (recursive)
  const filterSidebarByRole = useCallback((items, role) => {
    return items
      .filter((item) => !item.allowedFor || item.allowedFor.includes(role))
      .map((item) => ({
        ...item,
        children: item.children
          ? filterSidebarByRole(item.children, role)
          : undefined,
      }));
  }, []);

  // ✅ Guarded company logo and href loader
  // useEffect(() => {
  //   const platformKey = activePlatform?.platform?.toLowerCase();

  //   // let newLogo = FailedLogo;
  //   let newHref = "/patron/bulletin";

  //   if (platformKey === "patron" && !isLoading) {
  //     const patronCompany = JSON.parse(localStorage.getItem("patronCompany"));
  //     if (patronCompany?.name) {
  //       const url = `${ENDPOINT}/public/companies/${
  //         patronCompany.name
  //       }/logo.png?${new Date().getTime()}`;
  //       isImageValid(url, (valid) => {
  //         if (valid && url !== logo) setLogo(url);
  //       });
  //     }
  //   } else if (company?.name && platformKey && !isLoading) {
  //     const url = `${ENDPOINT}/public/companies/${
  //       company.name
  //     }/profile/logo.png?${new Date().getTime()}`;
  //     isImageValid(url, (valid) => {
  //       if (valid && url !== logo) setLogo(url);
  //     });

  //     newHref = `/${platformKey}/${
  //       ["manager", "headquarter"].includes(platformKey)
  //         ? "dashboard"
  //         : "bulletin"
  //     }`;
  //   }

  //   if (newHref !== href) setHref(newHref);
  // }, [company, activePlatform, isLoading, href, logo]);

  // ✅ Guarded sidebar loader with platform/role filtering
  const normalizePlatform = (platform) =>
    platform?.toLowerCase().replace(/\s/g, "_");

  useEffect(() => {
    const platformKey = normalizePlatform(activePlatform?.platform);

    if (!platformKey || platformKey === "patron") {
      const newLinks = Sidebars["patron"] || [];
      if (JSON.stringify(links) !== JSON.stringify(newLinks)) {
        setLinks(newLinks);
      }
      return;
    }

    const fullSidebar = Sidebars[platformKey] || [];

    if (platformKey === "laboratory") {
      const role = activePlatform?.role || "Junior MedTech";
      const filtered = filterSidebarByRole(fullSidebar, role);
      if (JSON.stringify(links) !== JSON.stringify(filtered)) {
        setLinks(filtered);
      }
    } else {
      if (JSON.stringify(links) !== JSON.stringify(fullSidebar)) {
        setLinks(fullSidebar);
      }
    }
  }, [activePlatform, company, links, filterSidebarByRole]);

  // 🔁 Recursive nav render
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
            {renderNavItems(
              item.children,
              key,
              normalizePlatform(fullPath),
              level + 1
            )}
          </MDBSideNavCat>
        );
      }

      return (
        <MDBSideNavLink
          key={key}
          to={normalizePlatform(fullPath)}
          topLevel
          onClick={onLinkClick}
          style={indentStyle}
          title={item.title}
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
        {/* Header */}
        <div className="text-center mt-2 " style={{ marginBottom: "-10px" }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "65px", aspectRatio: "1/1" }}
          />
          <div className="mt-2 text-dark" style={{ fontWeight: 500 }}>
            {activePlatform?.branch?.company || company?.name}
          </div>
        </div>
        <hr />
        {/* Nav */}
        <MDBSideNavNav>
          {!isLoading
            ? renderNavItems(
                links,
                "sidebar",
                `/${normalizePlatform(activePlatform?.platform || "patron")}`
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
    </div>
  );
}
