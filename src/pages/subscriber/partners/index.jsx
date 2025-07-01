import React from "react";
import { useSelector } from "react-redux";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import HMO from "../../../services/fakeDb/hmo";

export default function Partners() {
  const { details } = useSelector(({ companies }) => companies),
    hmoCodes = (details?.hmo || []).map((item) => item.code),
    partners = HMO.collections.filter(
      (item) =>
        hmoCodes.includes(item.code) &&
        item.icon &&
        item.icon !== "/assets/logo/default.png"
    );

  return (
    <div className="subscriber-partners-section">
      <h1 className="subscriber-testimonials-title mb-5">
        Accredited HMO Partners
      </h1>

      <Swiper
        modules={[Autoplay]}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove={false}
        spaceBetween={0}
        slidesPerView={7}
        breakpoints={{
          576: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 25 },
          1600: { slidesPerView: 6, spaceBetween: 30 },
        }}
      >
        {partners.map((hmo, index) => (
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
    </div>
  );
}
