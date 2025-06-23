import React, { useState, useEffect } from "react";
import {
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from "mdbreact";
import "./style.css";
import { useToasts } from "react-toast-notifications";
// import GoogleMapReact from "google-map-react";
import LOGO from "./../../../assets/iMD.png";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";
import { ENDPOINT, mobile } from "../../../services/utilities";

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ContactUs() {
  const { details } = useSelector(({ companies }) => companies),
    { addToast } = useToasts(),
    [alreadySent, setAlreadySent] = useState(false),
    [form, setForm] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  // For geolocation
  const userPosition = [15.35, 121.05];

  useEffect(() => {
    const feedback = localStorage.getItem("feedback");
    if (feedback) {
      setAlreadySent(true);
      setForm(JSON.parse(feedback));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    //console.log(auth._id);

    addToast("Thank you for the feedback.", {
      appearance: "success",
    });
    addToast("Thank you for the feedback.", {
      appearance: "success",
    });

    setAlreadySent(true);
    localStorage.setItem("feedback", JSON.stringify(form));
  };

  const { name, subject, email, message } = form;
  const { contacts = {} } = details || {};

  return (
    <section className="d-flex justify-content-center align-content-center">
      <div className="contactUs-container">
        <div className="contactUs-top">
          <div className="contactUs-leftSide">
            <div className="contactUs-logo">
              <img
                src={`${ENDPOINT}/public/companies/${details?.name}/logo.png`}
                alt="logo"
                onError={(e) => (e.target.src = LOGO)}
                width="90px"
                height="90px"
              />
              <span>{details?.name}</span>
            </div>
            <span className="contactUs-quote">{details?.tagline}</span>
            <div className="contactUs-address">
              <MDBIcon fas icon="map-marker-alt" />
              <span>
                Labanos Compound, Gulod street, barangay San pedro, General
                Tinio(Papaya), Nueva Ecija, Philippines
              </span>
            </div>
            <div className="contactUs-email">
              <MDBIcon fas icon="envelope" />
              <span> {contacts?.email}</span>
            </div>
            <div className="contactUs-phone">
              <MDBIcon fas icon="phone-alt" />
              <span> {mobile(contacts?.mobile)}</span>
            </div>
          </div>
          <div className="contactUs-middleSide">
            <div style={{ height: "100%", width: "100%" }}>
              <Map
                center={userPosition}
                zoom={12}
                style={{ height: "100%", width: "100%", borderRadius: "5px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={userPosition}>
                  <Popup>
                    Pinoy iMD — Labanos Compound, Gulod street, barangay San
                    pedro, General Tinio(Papaya)
                  </Popup>
                </Marker>
              </Map>
            </div>
          </div>
        </div>
        <div className="contactUs-rightSide">
          <span className="contactUs-emailUs">Contact Us:</span>
          <div style={{ marginTop: "-20px" }}>
            <form onSubmit={handleSubmit}>
              <MDBInput
                icon="user"
                label="Your name"
                labelClass="white-text"
                className="text-white"
                iconClass="white-text"
                type="text"
                value={name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="form-name"
              />
              <MDBInput
                icon="envelope"
                label="Your email"
                labelClass="white-text"
                className="text-white"
                iconClass="white-text"
                type="email"
                value={email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <MDBInput
                icon="tag"
                label="Subject"
                labelClass="white-text"
                className="text-white"
                iconClass="white-text"
                value={subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                type="text"
              />

              <MDBInput
                icon="pencil-alt"
                label="Your message"
                labelClass="white-text"
                className="text-white"
                iconClass="white-text "
                type="textarea"
                rows={1}
                value={message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />

              <div className="text-right">
                <MDBBtn disabled={alreadySent} type="submit" color="primary">
                  {alreadySent ? "E-mail Sent" : "Send"}
                </MDBBtn>
              </div>
            </form>
          </div>
        </div>

        <div></div>
        <div></div>
      </div>
    </section>
  );
}
