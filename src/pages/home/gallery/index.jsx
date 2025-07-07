import React, { useState } from "react";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import img1 from "./../../../assets/homeImg.jpg";
import img2 from "./../../../assets/homeMachine.jpg";
import img3 from "./../../../assets/homeMedical.jpg";
import img4 from "./../../../assets/male.jpg";
import img5 from "./../../../assets/physician1.jpg";

const allImg = [img1, img2, img3, img4, img5];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(allImg[0]);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const currentIndex = allImg.indexOf(selectedImage);

  const showNext = () => {
    const nextIndex = (currentIndex + 1) % allImg.length;
    setSelectedImage(allImg[nextIndex]);
  };

  const showPrev = () => {
    const prevIndex = (currentIndex - 1 + allImg.length) % allImg.length;
    setSelectedImage(allImg[prevIndex]);
  };

  return (
    <div className="homePage-gallery-section">
      <h1 className="homePage-gallery-title mb-5">Dev Team Building</h1>

      <div className="homePage-gallery-container">
        <img
          alt="Main Display"
          src={selectedImage}
          className="homePage-main-image"
          onClick={openModal}
          style={{ cursor: "zoom-in" }}
        />

        <div className="homePage-horizontal-swiper-wrapper">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            allowTouchMove={true}
            spaceBetween={10}
            slidesPerView={4}
            style={{ height: "150px" }}
          >
            {allImg.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Slide-${index}`}
                  className="homePage-swiper-img"
                  onClick={() => setSelectedImage(src)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="homePage-image-modal" onClick={closeModal}>
          <div
            className="homePage-image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImage} alt="Full view" />
            <button className="homePage-close-button" onClick={closeModal}>
              ×
            </button>
            <button className="homePage-nav-button prev" onClick={showPrev}>
              ‹
            </button>
            <button className="homePage-nav-button next" onClick={showNext}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
