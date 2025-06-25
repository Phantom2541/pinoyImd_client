import { useState, useEffect } from "react";
import { MDBIcon, MDBInput, MDBBtn } from "mdbreact";
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
import {
  ENDPOINT,
  fullAddress,
  LatitudeAddress,
  mobile,
} from "../../../services/utilities";
import { capitalize } from "lodash";

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
  const { contacts = {}, address = "" } = details || {};

  const [coordinates, setCoordinates] = useState([15.35, 121.05]); // default lang

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            LatitudeAddress(address)
          )}&format=json`,
          {
            headers: {
              "User-Agent": "PinoyIMD/1.0 (your_email@example.com)", // required by Nominatim
            },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <section className="subscriber-contactUs-section">
      <div className="subscriber-contactUs-container">
        <div className="subscriber-contactUs-info-container">
          <div className="subscriber-contactUs-logo">
            <img
              src={`${ENDPOINT}/public/companies/${details?.name}/logo.png`}
              alt="logo"
              onError={(e) => (e.target.src = LOGO)}
              width="90px"
              height="90px"
            />
            <span>{details?.name}</span>
          </div>
          <div className="subscriber-contactUs-details">
            <span className="subscriber-contactUs-quote">
              "{details?.tagline}"
            </span>
            <div className="subscriber-contactUs-address">
              <MDBIcon fas icon="map-marker-alt" />
              <span>{fullAddress(address)}</span>
              <div className="subscriber-contactUs-map">
                <Map
                  center={coordinates}
                  zoom={12}
                  style={{
                    height: "90%",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={coordinates}>
                    <Popup>{capitalize(fullAddress(address))}</Popup>
                  </Marker>
                </Map>
              </div>
            </div>
            <div className="subscriber-contactUs-email">
              <MDBIcon fas icon="envelope" />
              <span> {contacts?.email}</span>
            </div>
            <div className="subscriber-contactUs-phone">
              <MDBIcon fas icon="phone-alt" />
              <span> {mobile(contacts?.mobile)}</span>
            </div>
          </div>
        </div>

        <div className="subscriber-contactUs-quickLinks-container">
          <p>Quick Links</p>
          <div className="subscriber-contactUs-quickLinks">
            <a href="/">Home</a>
            <a href="/">Features</a>
            <a href="/">Doctors</a>
            <a href="/">Employees</a>
            <a href="/">Testimonials</a>
            <a href="/">Contact Us</a>
          </div>
        </div>

        <div className="subscriber-contactUs-branches-container">
          <p>Branches</p>
          <div className="subscriber-contactUs-branches">
            <span>Quezon City Branch</span>
            <span>Makati Medical Center</span>
            <span>Cebu City Diagnostic Hub</span>
            <span>Davao Health and Wellness Center</span>
          </div>
        </div>

        <div className="subscriber-contactUs-schedule-container">
          <p>Opening Hours</p>
          <div className="subscriber-contactUs-schedule">
            <div className="subscriber-contactUs-schedule-day">
              <span>Monday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Tuesday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Wednesday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Thursday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Friday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Saturday :</span> <span>8:00am - 5:00pm</span>
            </div>
            <div className="subscriber-contactUs-schedule-day">
              <span>Sunday :</span> <span>8:00am - 5:00pm</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
