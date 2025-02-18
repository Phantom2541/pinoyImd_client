import React from "react";
import { MDBCol, MDBAvatar, MDBRow, MDBIcon } from "mdbreact";

export default function Pioneers() {
  const THOMAS = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/thomas.jpg`;
  // const TOMAS =  `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/tomas.jpg`;
  const BENEDICT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/earle.jpg`;
  const CHANNEY = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/channey.jpg`;
  const KEVIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/kev.jpg`;
  const ROVAN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rovan.jpg`;
  const VARGILIO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/vargilio.jpg`;
  const REY = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rovan.jpg`;
  const RIC = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/ric.jpg`;

  const PIONEERS = [
    {
      name: "Thomas Pajarillaga",
      role: "CTO",
      quote: "Transforming ideas into seamless and intuitive web experiences.",
      img: THOMAS,
    },
    {
      name: "Tomas Pajarillaga Jr.",
      role: "CEO",
      quote:
        "Powering applications with robust and efficient server-side functionality.",
      // img: "https://mdbootstrap.com/img/Photos/Avatars/img%20(32).jpg",
    },
    {
      name: "Benedict Pajarillaga",
      role: "COO",
      quote:
        "Transforming visions into pixel-perfect designs that leave a lasting impression.",
      img: BENEDICT,
    },
    {
      name: "Channey Y'dreo Marzan",
      role: "LSE",
      quote:
        "Generating innovative solutions that drive business growth and enhance user experience.",

      img: CHANNEY,
    },
    {
      name: "Kevin Felix Caluag",
      role: "Project Manager",
      quote: "Turn Business Ideas into Reality",
      img: KEVIN,
    },
    {
      name: "Rey John Paul Limbo",
      role: "Senior Software Engineer",
      quote: "Building scalable and efficient web applications.",
      img: REY,
    },
    {
      name: "Vargilio Lavidad",
      role: "Senior Software Engineer",
      quote: "Building scalable and efficient web applications.",
      img: VARGILIO,
    },
    {
      name: "Rovan Abello",
      role: "Senior Software Engineer",
      quote: "Building scalable and efficient web applications.",
      img: ROVAN,
    },
    {
      name: "Ric Darrel Pajarillaga",
      role: "Senior Software Engineer",
      quote: "Building scalable and efficient web applications.",
      img: RIC,
    },
  ];
  return (
    <section className="team-section text-center my-5">
      <h1 className="text-center my-5 h1">Pioneers</h1>
      <p className="text-center mb-5 w-responsive mx-auto">
        Our team is composed of talented professionals with diverse expertise,
        working collaboratively to deliver exceptional results for our clients.
      </p>

      <MDBRow className="text-center">
        {PIONEERS.map((pioneer, index) => (
          <MDBCol md="4" className="mb-4" key={index}>
            <div className="testimonial">
              <img
                tag="img"
                style={{ width: "200px", height: "200px" }}
                src={pioneer.img}
                className="z-depth-1 rounded-circle img-fluid"
              />

              <h4 className="font-weight-bold mt-4 mb-3">{pioneer.name}</h4>
              <h6 className="mb-3 font-weight-bold grey-text">
                {pioneer.role}
              </h6>
              <p>
                <MDBIcon icon="quote-left" /> {pioneer.quote}
              </p>
            </div>
          </MDBCol>
        ))}
      </MDBRow>
    </section>
  );
}
