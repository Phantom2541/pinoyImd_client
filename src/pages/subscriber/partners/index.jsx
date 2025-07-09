import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import HMO from "../../../services/fakeDb/hmo";

export default function Partners() {
  const [showAll, setShowAll] = useState(false);
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);
  const { details } = useSelector(({ companies }) => companies),
    hmoCodes = (details?.hmo || []).map((item) => item.code),
    partners = HMO.collections.filter(
      (item) =>
        hmoCodes.includes(item.code) &&
        item.icon &&
        item.icon !== "/assets/logo/default.png"
    );

  useEffect(() => {
    if (showAll && containerRef.current) {
      setHeight(containerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [showAll]);

  return (
    <div className={`subscriber-partners-section`}>
      <h1 className="subscriber-testimonials-title mb-5">
        Accredited HMO Partners
      </h1>

      <Swiper
        className={`subscriber-partners-wrapper ${
          showAll ? "hideHMO" : "showHMO"
        }`}
        modules={[Autoplay]}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={true}
        spaceBetween={0}
        slidesPerView={7}
        breakpoints={{
          576: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 25 },
          1600: { slidesPerView: 6, spaceBetween: 30 },
        }}
      >
        {partners.slice(1).map((hmo, index) => (
          <SwiperSlide key={index}>
            <div className="subscriber-partners-container">
              <img
                src={hmo.icon}
                alt={hmo.abbr || `Partner ${index}`}
                style={{ height: "80px", objectFit: "contain" }}
                className="subscriber-partners-image"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={containerRef}
        className="subscriber-partners-imageAll-container"
        style={{ height: `${height}px` }}
      >
        {partners.slice(1).map((hmo, index) => (
          <div key={index} className="subscriber-partners-container">
            <img
              src={hmo.icon}
              alt={hmo.abbr || `Partner ${index}`}
              style={{ height: "80px", objectFit: "contain" }}
              className="subscriber-partners-image"
            />
            {/* <span>{hmo.abbr}</span> */}
          </div>
        ))}
      </div>
      <button
        className="subscriber-partners-arrow-button-down"
        onClick={() => setShowAll(!showAll)}
      >
        <span className="subscriber-partners-arrow-wrapper">
          <i
            className={`fas fa-chevron-${
              showAll ? "up" : "down"
            } subscriber-partners-arrow ${
              showAll
                ? "subscriber-partners-arrowUpAnimaton"
                : "subscriber-partners-arrowDownAnimaton"
            } subscriber-partners-main`}
          ></i>
          <i
            className={`fas fa-chevron-${
              showAll ? "up" : "down"
            } subscriber-partners-arrow ${
              showAll
                ? "subscriber-partners-arrowUpAnimaton"
                : "subscriber-partners-arrowDownAnimaton"
            } subscriber-partners-trail1`}
          ></i>
          <i
            className={`fas fa-chevron-${
              showAll ? "up" : "down"
            } subscriber-partners-arrow ${
              showAll
                ? "subscriber-partners-arrowUpAnimaton"
                : "subscriber-partners-arrowDownAnimaton"
            } subscriber-partners-trail2`}
          ></i>
        </span>
      </button>
    </div>
  );
}
