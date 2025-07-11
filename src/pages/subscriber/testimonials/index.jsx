import React, { useState } from "react";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import AVATAR from "./../../../assets/male.jpg";
import { MDBAnimation } from "mdbreact";

const testimonials = [
  {
    name: "Maria Santos",
    review: "Ang staff sobrang approachable at magaan kausap.",
    image: "/images/client1.jpg",
  },
  {
    name: "Jenny Cruz",
    review: "Super smooth ng treatment, walang hapdi!",
    image: "/images/client2.jpg",
  },
  {
    name: "Carla Mendoza",
    review: "Sobrang linis ng clinic at very relaxing ambiance.",
    image: "/images/client3.jpg",
  },
  {
    name: "Ella Ramos",
    review: "Very accommodating sila at magaling mag-explain.",
    image: "/images/client4.jpg",
  },
  {
    name: "Alyssa Dela Cruz",
    review: "Kitang kita agad ang effect after ng session.",
    image: "/images/client5.jpg",
  },
  {
    name: "Trisha Bautista",
    review: "Sobrang sulit every peso, sobrang galing!",
    image: "/images/client6.jpg",
  },
  {
    name: "Lianne Navarro",
    review: "Highly recommended lalo na sa first timers!",
    image: "/images/client7.jpg",
  },
  {
    name: "Bea Villanueva",
    review: "Ang ganda ng service, very professional.",
    image: "/images/client8.jpg",
  },
  {
    name: "Katrina Lopez",
    review: "Sobrang gaan ng kamay ng staff. Love it!",
    image: "/images/client9.jpg",
  },
  {
    name: "Roxanne Lim",
    review: "Laging on time ang appointment, very organized.",
    image: "/images/client10.jpg",
  },
  {
    name: "Jasmine Uy",
    review: "Nag-improve talaga skin ko. Thank you!",
    image: "/images/client11.jpg",
  },
  {
    name: "Camille Torres",
    review: "Gentle and effective. Worth every visit.",
    image: "/images/client12.jpg",
  },
  {
    name: "Nicole Reyes",
    review: "Grabe, bumalik yung confidence ko!",
    image: "/images/client13.jpg",
  },
  {
    name: "Bianca Soriano",
    review: "Hindi lang sila magaling, mababait pa!",
    image: "/images/client14.jpg",
  },
  {
    name: "Yna Dominguez",
    review: "Every session feels like self-care time.",
    image: "/images/client15.jpg",
  },
  {
    name: "Daphne Morales",
    review: "Consistent ang results — very satisfied!",
    image: "/images/client16.jpg",
  },
  {
    name: "April Carreon",
    review: "Super relaxing ng treatment area nila.",
    image: "/images/client17.jpg",
  },
  {
    name: "Mika Villareal",
    review: "No pain at all, pero ang laki ng effect!",
    image: "/images/client18.jpg",
  },
  {
    name: "Monique Garcia",
    review: "Friendly staff and very hygienic environment.",
    image: "/images/client19.jpg",
  },
  {
    name: "Patricia Chua",
    review: "Thank you for making my skin glow again!",
    image: "/images/client20.jpg",
  },
  {
    name: "Nina Francisco",
    review: "Sobrang satisfied ako sa result — legit!",
    image: "/images/client21.jpg",
  },
  {
    name: "Angela Ramos",
    review: "Hindi ko na kailangan ng filter sa photos!",
    image: "/images/client22.jpg",
  },
  {
    name: "Faye Sarmiento",
    review: "Pangalawang session ko pa lang, kita na agad effect.",
    image: "/images/client23.jpg",
  },
  {
    name: "Denise Yulo",
    review: "The best clinic experience ever. Highly recommend!",
    image: "/images/client24.jpg",
  },
];

export default function Testimonials() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleMouseMove = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    setHover(index + (isHalf ? 0.5 : 1));
  };

  const handleClick = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const isHalf = x < width / 2;
    setRating(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const displayValue = hover || rating;
  return (
    <>
      <h1 className="subscriber-testimonials-title mb-3">Testimonials</h1>
      <div className="subscriber-testimonials-section">
        <div className="subscriber-testimonials-container">
          <MDBAnimation
            reavel
            duration="1000ms"
            type="slideInLeft"
            className="subscriber-testimonials-text"
          >
            <h1>We believe in the power of community</h1>
            <p>
              Our goal is to create a product and service that you're satisfied
              with and use every day. This is why we're constantly working on
              our services to make them better and really listen to what our
              users have to say.
            </p>
          </MDBAnimation>

          <div className="subscriber-testimonials-sliderContainer-responsive">
            <MDBAnimation
              reavel
              type="fadeIn"
              duration="1500ms"
              className="subscriber-testimonials-sliderContainer"
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
                allowTouchMove={false}
                spaceBetween={0}
                slidesPerView={4}
                style={{ height: "600px" }}
              >
                {testimonials.map((t, index) => (
                  <SwiperSlide key={index}>
                    <div className="subscriber-testimonials-sliderCard">
                      <img src={AVATAR} alt={t.name} />
                      <div className="subscriber-testimonials-review">
                        <div
                          className="subscriber-testimonials-star-rating"
                          onMouseLeave={handleMouseLeave}
                        >
                          {[0, 1, 2, 3, 4].map((_, index) => {
                            let className = "subscriber-testimonials-star";
                            if (displayValue >= index + 1) {
                              className += " full";
                            } else if (displayValue >= index + 0.5) {
                              className += " half";
                            }

                            return (
                              <span
                                key={index}
                                className={className}
                                onMouseMove={(e) => handleMouseMove(e, index)}
                                onClick={(e) => handleClick(e, index)}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <span className="subscriber-testimonials-review-text">
                          "{t.review}"
                        </span>
                        <span className="subscriber-testimonials-review-name">
                          - {t.name}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </MDBAnimation>

            <MDBAnimation
              reveal
              type="fadeIn"
              duration="1500ms"
              className="subscriber-testimonials-sliderContainer"
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
                allowTouchMove={false}
                spaceBetween={0}
                slidesPerView={4}
                style={{ height: "600px" }}
                className="swiper-vertical-reverse"
              >
                {testimonials.map((t, index) => (
                  <SwiperSlide key={index}>
                    <div className="subscriber-testimonials-sliderCard">
                      <img src={AVATAR} alt={t.name} />
                      <div className="subscriber-testimonials-review">
                        <div
                          className="subscriber-testimonials-star-rating"
                          onMouseLeave={handleMouseLeave}
                        >
                          {[0, 1, 2, 3, 4].map((_, index) => {
                            let className = "subscriber-testimonials-star";
                            if (displayValue >= index + 1) {
                              className += " full";
                            } else if (displayValue >= index + 0.5) {
                              className += " half";
                            }

                            return (
                              <span
                                key={index}
                                className={className}
                                onMouseMove={(e) => handleMouseMove(e, index)}
                                onClick={(e) => handleClick(e, index)}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <span className="subscriber-testimonials-review-text">
                          "{t.review}"
                        </span>
                        <span className="subscriber-testimonials-review-name">
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
