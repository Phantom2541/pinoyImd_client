import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
// import logo from "./../../../assets/iMD.png";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../services/utilities";
import fallbackLogo from "./../../../assets/iMD.png"; // fallback image
import { BgRemover } from "../../../components/images/index";
import { MDBAnimation } from "mdbreact";

export default function SuppliersSubs() {
  const { collections } = useSelector(({ companies }) => companies);

  const supplierCompanies = collections.filter(
    (company) => company.category?.toLowerCase() === "supplier"
  );

  // Determine slidesPerView based on window width (simplified)
  // You can improve this by using a hook to get window width dynamically if needed
  const getSlidesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1600) return 6;
    if (width >= 1200) return 4;
    if (width >= 576) return 3;
    return 3;
  };

  const slidesPerView = getSlidesPerView();

  // If supplierCompanies.length is less or equal slidesPerView, disable loop and autoplay, center slides
  const isFewSlides = supplierCompanies.length <= slidesPerView;

  return (
    <div className="affiliates-section">
      <MDBAnimation reveal type="fadeInDown" duration="1.5s" delay=".5s">
        <h1 className="affiliates-title">Suppliers</h1>
      </MDBAnimation>
      {supplierCompanies?.length > 0 && (
        <Swiper
          className="affiliates-swiper"
          modules={[Autoplay]}
          loop={!isFewSlides}
          speed={4000}
          autoplay={
            !isFewSlides
              ? {
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  reverseDirection: false,
                }
              : false
          }
          allowTouchMove={true}
          spaceBetween={0}
          slidesPerView={slidesPerView}
          centeredSlides={isFewSlides}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 15 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            1200: { slidesPerView: 3, spaceBetween: 25 },
            1600: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {supplierCompanies.map((item, index) => {
            const { branches = [] } = item;

            // Get first main branch (or undefined)
            const mainBranch = branches.find(
              (branch) => branch.isMain === true
            );
            const address = mainBranch?.address || {};
            const logoUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
              item.name
            )}/profile/logo`;
            return (
              <SwiperSlide key={item._id || index}>
                <div className="affiliates-logo-wrapper">
                  <MDBAnimation
                    reveal
                    type="flipInX"
                    duration="1.5s"
                    delay=".5s"
                  >
                    <BgRemover
                      className="affiliates-logo"
                      src={logoUrl}
                      alt={item.name}
                      fallback={fallbackLogo}
                    />
                  </MDBAnimation>
                  <MDBAnimation
                    className="affiliates-logo-info"
                    reveal
                    type="fadeInUp"
                    duration="1.5s"
                    delay="1s"
                  >
                    <span className="affiliates-logo-name">{item.name}</span>
                    <span className="affiliates-logo-subname">
                      {item.subName}
                    </span>
                    <small className="affiliates-logo-address">
                      {address.city}
                    </small>
                  </MDBAnimation>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}
