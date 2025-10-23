import React, { useMemo } from "react";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { MDBAnimation } from "mdbreact";
import testimonials from "./collections.js";
import LOGO from "./../../../assets/iMD.png";
export default function Testimonials() {
  // Function to shuffle an array (Fisher-Yates)
  const shuffleArray = (arr) => {
    const arrayCopy = [...arr];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
  };

  // Two different shuffled arrays for two sliders
  const shuffledTestimonials1 = useMemo(() => shuffleArray(testimonials), []);
  const shuffledTestimonials2 = useMemo(() => shuffleArray(testimonials), []);

  return (
    <>
      <MDBAnimation reveal type="fadeInDown" duration="1.5s" delay=".5s">
        <h1 className="homePage-testimonials-title mb-5">Testimonials</h1>
      </MDBAnimation>
      <div className="homPage-testimonials-section">
        <div className="homPage-testimonials-container">
          <MDBAnimation
            reveal
            type="fadeInLeft"
            duration="1.5s"
            delay=".5s"
            className="homePage-testimonials-text"
          >
            <h1>We believe in the power of community</h1>
            <p>
              Our goal is to create a product and service that your're satisfied
              with and use it every day. This is why we're constantly working on
              our services to make it better every day and really listen to what
              our users has to say.
            </p>
          </MDBAnimation>

          <div className="homePage-testimonials-sliderContainer-responsive">
            <MDBAnimation
              reveal
              type="fadeIn"
              duration="1.5s"
              delay="1s"
              className="homePage-testiminials-sliderContainer hide"
            >
              {shuffledTestimonials1?.length > 0 && (
                <Swiper
                  modules={[Autoplay]}
                  direction="vertical"
                  loop={true}
                  speed={5000}
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                  }}
                  allowTouchMove={false}
                  spaceBetween={0}
                  slidesPerView={4}
                  style={{ height: "600px" }}
                >
                  {shuffledTestimonials1.map((t, index) => (
                    <SwiperSlide key={index}>
                      <div className="homePage-testiminials-sliderCard">
                        <img
                          src={t.image}
                          alt={t.name}
                          onError={(e) => (e.target.src = LOGO)}
                        />
                        <div className="homePage-testimonials-review">
                          <div className="homePage-testimonials-star-rating">
                            {[0, 1, 2, 3, 4].map((_, i) => {
                              let className = "homePage-testimonials-star";
                              if (t.rating >= i + 1) {
                                className += " full";
                              } else if (t.rating >= i + 0.5) {
                                className += " half";
                              }
                              return (
                                <span key={i} className={className}>
                                  ★
                                </span>
                              );
                            })}
                          </div>
                          <span className="homePage-testimonials-review-text">
                            "{t.review}"
                          </span>
                          <span className="homePage-testimonials-review-name">
                            - {t.name}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </MDBAnimation>
            <MDBAnimation
              reveal
              type="fadeIn"
              duration="1.5s"
              delay="1.5s"
              className="homePage-testiminials-sliderContainer"
            >
              <Swiper
                modules={[Autoplay]}
                direction="vertical"
                loop={true}
                speed={5000}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                simulateTouch={false}
                allowTouchMove={false}
                touchStartPreventDefault={false} // 🔹 importante
                passiveListeners={false} // 🔹 para sa mga mobile browsers
                spaceBetween={0}
                style={{ height: "600px" }}
                className="swiper-vertical-reverse"
                breakpoints={{
                  0: { slidesPerView: 5, spaceBetween: 5 },
                  1200: { slidesPerView: 4, spaceBetween: 5 },
                  1600: { slidesPerView: 4, spaceBetween: 5 },
                }}
              >
                {shuffledTestimonials2.map((t, index) => (
                  <SwiperSlide key={index}>
                    <div className="homePage-testiminials-sliderCard">
                      <img
                        src={t.image}
                        alt={t.name}
                        onError={(e) => (e.target.src = LOGO)}
                      />
                      <div className="homePage-testimonials-review">
                        <div className="homePage-testimonials-star-rating">
                          {[0, 1, 2, 3, 4].map((_, i) => {
                            let className = "homePage-testimonials-star";
                            if (t.rating >= i + 1) {
                              className += " full";
                            } else if (t.rating >= i + 0.5) {
                              className += " half";
                            }
                            return (
                              <span key={i} className={className}>
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <span className="homePage-testimonials-review-text">
                          "{t.review}"
                        </span>
                        <span className="homePage-testimonials-review-name">
                          - {t.name}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </MDBAnimation>
          </div>
        </div>
      </div>
    </>
  );
}
