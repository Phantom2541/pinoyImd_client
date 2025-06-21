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
import { useToasts } from "react-toast-notifications";
// import GoogleMapReact from "google-map-react";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ContactUs() {
  const { addToast } = useToasts(),
    [alreadySent, setAlreadySent] = useState(false),
    [form, setForm] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  // For geolocation
  const [userPosition, setUserPosition] = useState([15.1494, 120.6566]); // default sa Angeles
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    const feedback = localStorage.getItem("feedback");
    if (feedback) {
      setAlreadySent(true);
      setForm(JSON.parse(feedback));
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
          setLocationLoaded(true);
        },
        (err) => {
          console.error(err);
          setLocationLoaded(true);
        }
      );
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

  return (
    <section className="section pb-5 mb-5">
      <h2 className="section-heading h1 pt-4 text-center my-5">Contact us</h2>
      <p className="section-description mb-5 mb-3 text-center">
        We look forward to hearing from you and discussing how we can assist you
        with your needs.
      </p>

      <MDBRow>
        <MDBCol lg="5" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <div className="form-header blue-gradient">
                <h3 className="mt-2">
                  <MDBIcon icon="envelope" /> Write to us:
                </h3>
              </div>
              <p className="dark-grey-text">
                {alreadySent
                  ? "Your feedback is appreciated."
                  : "We'll write rarely, but only the best content."}
              </p>
              <form onSubmit={handleSubmit}>
                <div className="md-form">
                  <MDBInput
                    icon="user"
                    label="Your name"
                    iconClass="grey-text"
                    type="text"
                    value={name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    id="form-name"
                  />
                </div>
                <div className="md-form">
                  <MDBInput
                    icon="envelope"
                    label="Your email"
                    iconClass="grey-text"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="md-form">
                  <MDBInput
                    icon="tag"
                    label="Subject"
                    iconClass="grey-text"
                    value={subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    required
                    type="text"
                  />
                </div>
                <div className="md-form">
                  <MDBInput
                    icon="pencil-alt"
                    label="Your message"
                    iconClass="grey-text"
                    type="textarea"
                    value={message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="text-center">
                  <MDBBtn disabled={alreadySent} type="submit" color="primary">
                    {alreadySent ? "E-mail Sent" : "Submit"}
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol lg="7">
          <div style={{ height: 400 }} className="z-depth-2">
            <div style={{ height: "500px", width: "100%" }}>
              <Map
                center={userPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={userPosition}>
                  <Popup>
                    {locationLoaded
                      ? "You are here!"
                      : "Loading your location..."}
                  </Popup>
                </Marker>
              </Map>
            </div>
          </div>
          <br />
          <MDBRow className="text-center">
            <MDBCol md="6" className="col-md-4">
              <label className="btn-floating primary-color">
                <MDBIcon icon="map-marker-alt" />
              </label>
              <p>Cabanatuan City, Nueva Ecija</p>
              <p>Philippines</p>
            </MDBCol>

            <MDBCol md="6" className="col-md-4">
              <label className="btn-floating primary-color">
                <MDBIcon icon="phone" />
              </label>
              <p>+63 935-033-9777</p>
              <p>Sat - Fri, 6:00 AM - 6:00 PM</p>
            </MDBCol>

            {/* <MDBCol md="4" className="col-md-4">
              <a className="btn-floating primary-color" href="#!">
                <MDBIcon icon="envelope" />
              </a>
              <p>pinoy@gmail.com</p>
              <p>sale@gmail.com</p>
            </MDBCol> */}
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </section>
  );
}
