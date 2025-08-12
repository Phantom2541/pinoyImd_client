import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import logo from "./../../../assets/iMD.png";
import fallbackLogo from "./../../../assets/iMD.png"; // fallback image
import { Cloudinary, fullAddress } from "../../../services/utilities";
import { useSelector } from "react-redux";
import BgRemover from "../../../components/bgRemover";
import { Items } from "pdfjs-dist/build/pdf.worker";

export default function BetaTester() {
  const { collections } = useSelector(({ companies }) => companies);

  const cutoffDate = new Date("2025-08-12");

  const earlyCompanies = collections.filter((company) => {
    const companyDate = new Date(company.createdAt); // change to your actual date property
    return companyDate < cutoffDate;
  });

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
          0: { slidesPerView: 2, spaceBetween: 15 },
          576: { slidesPerView: 2, spaceBetween: 15 },
          1200: { slidesPerView: 4, spaceBetween: 25 },
          1600: { slidesPerView: 6, spaceBetween: 30 },
        }}
      >
        {earlyCompanies.map((item, index) => {
          const { branches = [] } = item;

          // Get first main branch (or undefined)
          const mainBranch = branches.find((branch) => branch.isMain === true);
          const address = mainBranch?.address || {};

          const logoUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
            item.name
          )}/profile/logo`;

          return (
            <SwiperSlide key={item._id || index}>
              <div className="affiliates-logo-wrapper">
                <BgRemover
                  className="affiliates-logo"
                  src={logoUrl}
                  alt={item.name}
                  fallback={fallbackLogo}
                />
                <span className="affiliates-logo-name">{item.name}</span>
                <span className="affiliates-logo-address">{address.city}</span>
                <span className="affiliates-logo-category">
                  {item.category}
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
