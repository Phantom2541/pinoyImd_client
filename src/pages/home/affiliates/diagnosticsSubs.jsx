import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import fallbackLogo from "./../../../assets/iMD.png"; // fallback image
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../services/utilities";

export default function DiagnosticsSubs() {
  const { collections } = useSelector(({ companies }) => companies);

  // Pre-filter once to avoid filtering inside render repeatedly
  const diagnosticCompanies = collections.filter(
    (company) => company.category?.toLowerCase() === "diagnostic"
  );

  return (
    <div className="affiliates-section">
      <h1 className="affiliates-title">Our Diagnostics Subscribers</h1>
      <Swiper
        className="affiliates-swiper"
        modules={[Autoplay]}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: true,
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
        {diagnosticCompanies.map((item, index) => {
          const logoUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
            item.name
          )}/profile/logo`;
          console.log("logoUrl", logoUrl);
          console.log("company", item.name);

          return (
            <SwiperSlide key={item._id || index}>
              <div className="affiliates-logo-wrapper">
                <img
                  className="affiliates-logo"
                  src={logoUrl}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = fallbackLogo; // use fallback if not found
                  }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
