import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import logo from "./../../../assets/iMD.png";

export default function BetaTester() {
  const logos = Array(10).fill(logo);

  return (
    <div className="affiliates-section">
      <h1 className="affiliates-title">Early Access Clients</h1>
      <Swiper
        className="affiliates-swiper"
        modules={[Autoplay]}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: true, // pa-right
        }}
        allowTouchMove={true}
        spaceBetween={0}
        slidesPerView={7}
        breakpoints={{
          0: { slidesPerView: 3, spaceBetween: 10 },
          576: { slidesPerView: 3, spaceBetween: 10 },
          1200: { slidesPerView: 4, spaceBetween: 25 },
          1600: { slidesPerView: 6, spaceBetween: 30 },
        }}
      >
        {logos.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="affiliates-logo-wrapper">
              <img
                className="affiliates-logo"
                src={src}
                alt={`Subscriber ${index + 1}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
