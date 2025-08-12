import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import logo from "./../../../assets/iMD.png";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../services/utilities";
import fallbackLogo from "./../../../assets/iMD.png"; // fallback image

export default function SuppliersSubs() {
  const { collections } = useSelector(({ companies }) => companies);

  // Pre-filter once to avoid filtering inside render repeatedly
  const supplierCompanies = collections.filter(
    (company) => company.category?.toLowerCase() === "supplier"
  );
  const logos = Array(10).fill(logo);

  return (
    <div className="affiliates-section">
      <h1 className="affiliates-title">Our Suppliers Subscribers</h1>
      <Swiper
        className="affiliates-swiper"
        modules={[Autoplay]}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: false, // pa-right
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
        {supplierCompanies.map((item, index) => {
          const logoUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
            item.name
          )}/profile/logo.JPG`;
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
