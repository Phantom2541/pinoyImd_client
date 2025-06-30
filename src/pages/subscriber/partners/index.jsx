import React from "react";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import AMAPHIL from "./../../../assets/subscriber/AlphaMedBranch/amaphil.png";
import AVEGA from "./../../../assets/subscriber/AlphaMedBranch/avega.png";
import COCOLIFE from "./../../../assets/subscriber/AlphaMedBranch/cocolife.png";
import ETIQA from "./../../../assets/subscriber/AlphaMedBranch/eqtiwa.jpg";
import GENERALI from "./../../../assets/subscriber/AlphaMedBranch/Generali.jpg";
import HMI from "./../../../assets/subscriber/AlphaMedBranch/Hmi.png";
import IMS from "./../../../assets/subscriber/AlphaMedBranch/Ims Wellth Care.png";
import INLIFE from "./../../../assets/subscriber/AlphaMedBranch/Inlife.png";
import INTELLICARE from "./../../../assets/subscriber/AlphaMedBranch/Intellicare.png";
import KAISER from "./../../../assets/subscriber/AlphaMedBranch/Kaiser.jpg";
import MEDASIA from "./../../../assets/subscriber/AlphaMedBranch/MedAsia.jpg";
import MEDICARD from "./../../../assets/subscriber/AlphaMedBranch/MediCard.jpg";
import MEDOCARE from "./../../../assets/subscriber/AlphaMedBranch/MedoCare.png";
import PACIFIC from "./../../../assets/subscriber/AlphaMedBranch/Pacific Cross.jpg";
import PHILBRITISH from "./../../../assets/subscriber/AlphaMedBranch/PhilBritish.png";
import PHILCARE from "./../../../assets/subscriber/AlphaMedBranch/PhilCare.jpg";
import SUNLIFE from "./../../../assets/subscriber/AlphaMedBranch/Sun Life.jpg";
import VALUCARE from "./../../../assets/subscriber/AlphaMedBranch/ValuCare.jpg";

const logos = [
  AMAPHIL,
  AVEGA,
  COCOLIFE,
  ETIQA,
  GENERALI,
  HMI,
  IMS,
  INLIFE,
  INTELLICARE,
  KAISER,
  MEDASIA,
  MEDICARD,
  MEDOCARE,
  PACIFIC,
  PHILBRITISH,
  PHILCARE,
  SUNLIFE,
  VALUCARE,
];

export default function Partners() {
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
          576: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
          1600: {
            slidesPerView: 6,
            spaceBetween: 30,
          },
        }}
      >
        {logos.map((logo, index) => (
          <SwiperSlide key={index}>
            <div className="subscriber-partners-container">
              <img
                src={logo}
                alt={`Partner ${index}`}
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
