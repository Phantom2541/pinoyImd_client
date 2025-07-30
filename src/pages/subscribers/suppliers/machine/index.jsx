import React from "react";
import { MDBAnimation } from "mdbreact";
import "./style.css";
// import LIS from "./../../../assets/LIS.jpg";

const collections = [
  {
    image: "1QcjggoN0aejxJ15RVjouUKDdZHwn9gLM",
    title: "hematology analyzer",
    description:
      "A hematology analyzer is a machine that tests blood to determine the number and condition of red blood cells, white blood cells, platelets, hemoglobin, and more — helping doctors detect infections, anemia, leukemia, and other conditions.",
  },
  {
    image: "1_5B9uZyxiZxkjaZKHwOSAE2R6ZKwl9At",
    title: "biochemistry analyzer",
    description:
      "A biochemistry analyzer is a machine that checks the chemical makeup of your blood, such as sugar levels, cholesterol, kidney and liver function — helping doctors diagnose and monitor various health conditions.",
  },
  {
    image: "1NlaE-m9sU5fcZzQAIVnXnocea5_2I4OP",
    title: "biochemistry analyzer",
    description:
      "A biochemistry analyzer is a machine that checks the chemical makeup of your blood, such as sugar levels, cholesterol, kidney and liver function — helping doctors diagnose and monitor various health conditions.",
  },
  {
    image: "1sRvAYyao4sl8PJ_SyGfV5at2LfJ9teMq",
    title: "fully automated hematology analyzer",
    description:
      "A fully automated hematology analyzer is a high-tech blood testing machine that works on its own to quickly and accurately count and measure blood cells — no need for manual counting or handling during the test.",
  },
];

export default function Machines() {
  return (
    <section className="supplier-aboutUs-section">
      <h1 className="supplier-aboutUs-title">Features</h1>
      <div className="supplier-aboutUs-container">
        {collections.map((item, index) => (
          <MDBAnimation
            key={index}
            reveal
            type="fadeInUp"
            duration="1000ms"
            className="supplier-AboutUs-card"
          >
            <div className="supplier-AboutUs-card-image">
              <img
                src={`https://drive.google.com/thumbnail?id=${item.image}`}
                alt={item.title}
              />
            </div>
            <div className="supplier-AboutUs-card-body">
              <div className="supplier-AboutUs-card-title">{item.title}</div>
              <div className="supplier-AboutUs-card-description">
                {item.description}
              </div>
            </div>
          </MDBAnimation>
        ))}
      </div>
    </section>
  );
}
