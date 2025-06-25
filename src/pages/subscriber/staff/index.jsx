import React from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Staffs() {
  const DEFAULT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/default.jpg`;
  const EMMAN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/emman.jpg`;
  const TOMAS = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/tomas.jpg`;
  const BENEDICT = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/earle.jpg`;
  // const CHANNEY = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/channey.jpg`;
  // const KEVIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/kev.jpg`;
  // const ROVAN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rovan.jpg`;
  // const VARGILIO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/vargilio.jpg`;
  const RIC = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/ric.jpg`;
  const JERWIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/jerwin.jpg`;
  const RICO = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/rico.png`;
  const MAGTALAS = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/kevin.jpg`;
  const NICK = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/nick.jpg`;
  const MELUIN = `${process.env.PUBLIC_URL}/assets/images/landing/pioneers/meluin.jpg`;

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
      title: "Chief Operating Officer",
      quote:
        "Transforming visions into pixel-perfect designs that leave a lasting impression.",
      img: BENEDICT,
    },
    {
      name: "Jerwin Jay J. Romero",
      role: "Project Manager",
      quote: "Think. Code. Debug. Repeat.",
      img: JERWIN,
    },
    {
      name: "Ric Darrel A. Pajarillaga",
      role: "Lead Software Engineer(Backend)",
      quote: "Building scalable and efficient web applications.",
      img: RIC,
    },
    {
      name: "Kevin P. Magtalas",
      role: "Lead Software Engineer(Frontend)",
      quote: "I'm not a magician, I'm a software engineer.",
      img: MAGTALAS,
    },
    {
      name: "Reynald Nick P. Magtalas",
      role: "Senior Software Engineer",
      quote: "Success is a series of small wins.",
      img: NICK,
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
      img: MELUIN,
    },
  ];
  return (
    <section className="team-section text-center">
      <h1 className="text-center mt-5 h1">Employees</h1>
      <p
        className="text-center mb-5 w-responsive mx-auto"
        style={{ fontWeight: "400" }}
      >
        Our team is composed of talented professionals with diverse expertise,
        working collaboratively to deliver exceptional results for our clients.
      </p>

      <div className="subscriber-pioneers-container">
        {PIONEERS.map((pioneer, index) => (
          <div className="subscriber-pioneers-card" key={index}>
            <img src={pioneer.img} alt="avatar" />
            <span>{pioneer.name}</span>
            <p>{pioneer.role}</p>
            <div className="d-flex align-items-center" style={{ gap: "15px" }}>
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="pioneerAvatarLink"
              >
                <MDBIcon fab icon="google" />
              </a>
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="pioneerAvatarLink"
              >
                <MDBIcon fab icon="facebook-f" />
              </a>
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="pioneerAvatarLink"
              >
                <MDBIcon fab icon="twitter" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
