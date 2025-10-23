import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./style.css";

export default function Client() {
  const images = [
    "1ZyMikNg9V_Qa-qGp-LL5hNHCvglpI4R4",
    "1maNoTEUlB4Aih6TOQysy1L-iTf47ofMm",
    "1YYapQg_JkZddYVgoB-2iOqjBToxG05Ax",
    "1S73G2xhcD-nXKAvi6GxaZvcGQSoHqjb4",
    "1UXsMaU9HcCVEtPqKtJLZe7tO1RKlVOwO",
    "1OyCjfn7jnTq4sKZi1TDeYLIphf1vSUtn",
    "1mVPxi59SN7TVIJvFSErBJuyL9zOXLfS6",
    "1O66GyhB9FjSMdrTOZPhq6Mmi6QV2N3_F",
  ];

  return (
    <div className="supplier-client-section">
      <div className="supplier-client-title">
        <h1>Healthcare Institutions We Support</h1>
      </div>
      {images.length > 0 && (
        <Swiper
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
            0: { slidesPerView: 3, spaceBetween: 10 },
            576: { slidesPerView: 3, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 25 },
            1600: { slidesPerView: 7, spaceBetween: 30 },
          }}
        >
          {images.map((id, index) => (
            <SwiperSlide key={index}>
              <img
                src={`https://drive.google.com/thumbnail?id=${id}`}
                alt={id}
                className="supplier-client-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
