import React, { useEffect, useState } from "react";
import { MDBAnimation, MDBIcon } from "mdbreact";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { Cloudinary, properFullname } from "../../../../services/utilities";
import { BROWSE } from "../../../../services/redux/slices/assets/branches";
import { orderBy } from "lodash";

export default function Employees({ match }) {
  const DEFAULT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/default.jpg`;

  const dispatch = useDispatch();
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic cards per row based on screen width
  const getCardsPerRow = () => {
    if (screenWidth <= 600) return 1;
    if (screenWidth <= 900) return 2;
    if (screenWidth <= 1200) return 3;
    return 4;
  };

  const cardsPerRow = getCardsPerRow();
  const CARDS_PER_PAGE = cardsPerRow * 2;

  const { filtered } = useSelector(({ branches }) => branches);

  useEffect(() => {
    const stored = localStorage.getItem("patronCompany");
    if (stored) {
      const parsed = JSON.parse(stored);

      // Use parsed._id directly (not state, which updates async)
      dispatch(
        BROWSE({
          key: { companyId: parsed._id },
        })
      );
    }
    // empty deps → runs once only on mount
  }, [dispatch]);

  const activeBranches = (filtered || []).filter(
    (o) => (o.settings?.status || "").trim().toLowerCase() === "active"
  );

  const sortedData = orderBy(
    activeBranches,
    [(o) => !o.isMain, (o) => o.name?.toLowerCase().trim()],
    ["asc", "asc"]
  );

  // Flatten all personnels across active + sorted branches
  const filteredPersonnels = sortedData.flatMap((branch) => {
    const { personnels = [] } = branch;
    return personnels
      .map((p, index) => ({ ...p, index }))
      .filter((p) => p.status?.toLowerCase() === "active");
  });

  const totalPersonnel = (filteredPersonnels || []).length;
  const totalPages = Math.max(1, Math.ceil(totalPersonnel / CARDS_PER_PAGE));

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection("next");
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection("prev");
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setDirection("next");
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prevPage) =>
          prevPage === totalPages - 1 ? 0 : prevPage + 1
        );
        setTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, totalPages]);

  const displayedPersonnels = filteredPersonnels.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  return (
    <section className=" subscriber-pioneers-section">
      <MDBAnimation reveal type="fadeIn" duration="1000ms">
        <h1 className="text-center mt-5 h1">Employees</h1>
        <p
          className="text-center mb-5 w-responsive mx-auto"
          style={{ fontWeight: "400" }}
        >
          Our team is composed of talented professionals with diverse expertise,
          working collaboratively to deliver exceptional results for our
          clients.
        </p>
      </MDBAnimation>

      <MDBAnimation
        reveal
        type="zoomIn"
        duration="1000ms"
        className="subscriber-pioneers-pagination-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="subscriber-pioneers-arrow-button-left"
        >
          <span
            className={`subscriber-pioneers-arrow-wrapper ${
              currentPage === 0 ? "no-animation" : ""
            }`}
          >
            <i className="fas fa-chevron-left subscriber-pioneers-arrow subscriber-pioneers-main"></i>
            <i className="fas fa-chevron-left subscriber-pioneers-arrow subscriber-pioneers-trail1"></i>
            <i className="fas fa-chevron-left subscriber-pioneers-arrow subscriber-pioneers-trail2"></i>
          </span>
        </button>

        <div
          className={`subscriber-pioneers-container ${
            transitioning ? `slide-${direction}` : ""
          }`}
        >
          {displayedPersonnels.map((person, index) => {
            const { user } = person || {};
            const { fullName, email } = user || {};
            const logoUrl = `${Cloudinary.getEndpoint()}/users/${encodeURIComponent(
              email
            )}/profile`;

            return (
              <div className="subscriber-pioneers-card" key={index}>
                <div className="subscriber-pioneers-card-header">
                  <img
                    src={logoUrl}
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = DEFAULT;
                    }}
                    alt={email}
                  />
                </div>
                <div className="subscriber-pioneers-card-body">
                  <span>{properFullname(fullName)}</span>
                </div>
                <div className="subscriber-pioneers-footer">
                  <a href="google.com" className="pioneerAvatarLink">
                    <MDBIcon fab icon="google" />
                  </a>
                  <a href="facebook.com" className="pioneerAvatarLink">
                    <MDBIcon fab icon="facebook-f" />
                  </a>
                  <a href="twitter.com" className="pioneerAvatarLink">
                    <MDBIcon fab icon="twitter" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className="subscriber-pioneers-arrow-button-right"
        >
          <span
            className={`subscriber-pioneers-arrow-wrapper ${
              currentPage === totalPages - 1 ? "no-animation" : ""
            }`}
          >
            <i className="fas fa-chevron-right subscriber-pioneers-arrow subscriber-pioneers-main"></i>
            <i className="fas fa-chevron-right subscriber-pioneers-arrow subscriber-pioneers-trail1"></i>
            <i className="fas fa-chevron-right subscriber-pioneers-arrow subscriber-pioneers-trail2"></i>
          </span>
        </button>
      </MDBAnimation>
    </section>
  );
}
