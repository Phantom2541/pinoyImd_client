import React from "react";
import { MDBCol, MDBRow, MDBIcon } from "mdbreact";

export default function Pioneers() {
  const DEFAULT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/default.jpg`;
  const EMMAN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/emman.jpg`;
  const TOMAS = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/tomas.jpg`;
  const BENEDICT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/earle.jpg`;
  const CHANNEY = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/channey.jpg`;
  const KEVIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/kev.jpg`;
  // const ROVAN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rovan.jpg`;
  const VARGILIO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/vargilio.jpg`;
  const RIC = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/ric.jpg`;
  const JERWIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/jerwin.jpg`;
  const RICO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rico.png`;
  const MAGTALAS = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/kevin.jpg`;
  const NICK = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/nick.jpg`;
  // const LIMBO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/limbo.jpg`;

  const PIONEERS = [
    {
      name: "Thomas Emmanuel R.Pajarillaga",
      role: "CTO",
      quote: "Transforming ideas into seamless and intuitive web experiences.",
      img: EMMAN,
    },
    {
      name: "Tomas B. Pajarillaga Jr.RMT, RN, MSIT",
      role: "CEO",
      quote:
        "Powering applications with robust and efficient server-side functionality.",
      img: TOMAS,
    },
    {
      name: "Benedict Earle Gabriel R. Pajarillaga",
      role: "COO",
      quote:
        "Transforming visions into pixel-perfect designs that leave a lasting impression.",
      img: BENEDICT,
    },
    // {
    //   name: "Channey Y'dreo Marzan",
    //   role: "Lead Software Engineer",
    //   quote: "Engineering the future, one line at a time.",

    //   img: CHANNEY,
    // },
    // {
    //   name: "Kevin Felix Caluag",
    //   role: "Project Manager",
    //   quote: "Turn Business Ideas into Reality",
    //   img: KEVIN,
    // },
    // {
    //   name: "Rey John Paul Limbo",
    //   role: "Software Engineer",
    //   quote: "Building scalable and efficient web applications.",
    //   img: RIC,
    // },
    // {
    //   name: "Vargilio Lavidad",
    //   role: "Software Engineer",
    //   quote: "Building scalable and efficient web applications.",
    //   img: VARGILIO,
    // },
    // {
    //   name: "Rovan O. Juit",
    //   role: "Software Engineer",
    //   quote: "Building scalable and efficient web applications.",
    //   img: ROVAN,
    // },
    {
      name: "Ric Darrel A. Pajarillaga",
      role: "Senior Software Engineer",
      quote: "Building scalable and efficient web applications.",
      img: RIC,
    },
    {
      name: "Reynald Nick P. Magtalas",
      role: "Junior Software Engineer",
      quote: "Success is a series of small wins.",
      img: NICK,
    },
    {
      name: "Kevin P. Magtalas",
      role: "Lead Software Engineer",
      quote: "I'm not a magician, I'm a software engineer.",
      img: MAGTALAS,
    },
    {
      name: "Jerwin Jay J. Romero",
      role: "Project Manager",
      quote: "Think. Code. Debug. Repeat.",
      img: JERWIN,
    },
    {
      name: "John Rico S. Avila",
      role: "Junior Software Engineer",
      quote: "First, solve the problem. Then, write the code.",
      img: RICO,
    },
    {
      name: "Dan Meluin M. Palaris",
      role: "Junior Software Engineer",
      quote: "Software grows, evolves, and never finishes.",
      img: DEFAULT,
    },
  ];
  return (
    <section className="team-section text-center">
      <h1 className="text-center my-5 h1">Pioneers</h1>
      <p className="text-center mb-5 w-responsive mx-auto">
        Our team is composed of talented professionals with diverse expertise,
        working collaboratively to deliver exceptional results for our clients.
      </p>

      <style>
        {`
          .testimonial-wrapper {
            position: relative;
            width: 210px;
            height: 210px;
            border-radius: 50%;
            overflow: hidden;
          }

          .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }

          .quote-overlay {
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px;
            transition: top .5s ease;
          }

          .testimonial-wrapper:hover .quote-overlay {
            top: 0;
          }
        `}
      </style>

      <MDBRow className="text-center">
        {PIONEERS.map((pioneer, index) => (
          <MDBCol md="3" className="" key={index}>
            <div className="d-flex flex-column align-items-center">
              <div className="testimonial-wrapper">
                <img
                  alt="avatar"
                  tag="img"
                  src={pioneer.img}
                  className="avatar-img z-depth-1 rounded-circle img-fluid"
                />
                <div className="quote-overlay">
                  <p style={{ fontWeight: 400 }}>"{pioneer.quote}"</p>
                </div>
              </div>

              <h4 className="font-weight-bold mt-4 mb-1">{pioneer.name}</h4>
              <h6 className="mb-3 font-weight-bold grey-text">
                {pioneer.role}
              </h6>
            </div>
          </MDBCol>
        ))}
      </MDBRow>
    </section>
  );
}
