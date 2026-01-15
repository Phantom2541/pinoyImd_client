import React, { useState, useEffect, useRef } from "react";
import { MDBAnimation, MDBIcon } from "mdbreact";
import "./style.css";
import LOGO from "./../../../../assets/iMD.png";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useToasts } from "react-toast-notifications";

import { useSelector } from "react-redux";
import {
  Cloudinary,
  fullAddress,
  LatitudeAddress,
  mobile,
} from "../../../../services/utilities";

// Fix Leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ContactUs() {
  const { details } = useSelector(({ companies }) => companies);

  const { contacts = {}, address = "", branches = [] } = details || {};

  const [coordinates, setCoordinates] = useState([15.35, 121.05]), // default lang
    { addToast } = useToasts();

  const logoUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    details?.name
  )}/logo`;

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
      } catch (error) {}
    };

    fetchCoordinates();
  }, [address]);

  const mapRef = useRef(null);

  const handleBranchClick = async (branch) => {
    if (!branch?.address) return;

    try {
      const convertedAddress = LatitudeAddress(branch.address);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          convertedAddress
        )}&format=json`,
        {
          headers: {
            "User-Agent": "PinoyIMD/1.0 (your_email@example.com)",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setCoordinates([lat, lon]);

        if (mapRef.current && mapRef.current.leafletElement) {
          mapRef.current.leafletElement.setView([lat, lon], 16);
        }
      } else {
        addToast("Street location not found.", { appearance: "error" });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      addToast("Error detecting location.", { appearance: "error" });
    }
  };

  return (
    <section className="subscriber-contactUs-section">
      <div className="subscriber-contactUs-container">
        <MDBAnimation
          reveal
          type="fadeIn"
          duration="1000ms"
          className="subscriber-contactUs-leftSide"
        >
          <div className="subscriber-contactUs-logo">
            <img
              src={logoUrl}
              alt="logo"
              loading="lazy"
              onError={(e) => (e.target.src = LOGO)}
              width="90px"
              height="90px"
            />
            <span>{details?.name}</span>
          </div>
          <span className="contactUs-quote">"{details?.tagline}"</span>
          <div className="subscriber-contactUs-address">
            <MDBIcon fas icon="map-marker-alt" />
            <span onClick={() => handleBranchClick({ address })}>
              {fullAddress(address)}
            </span>
          </div>
          <div className="subscriber-contactUs-email">
            <MDBIcon fas icon="envelope" />
            <span> {contacts?.email}</span>
          </div>
          <div className="subscriber-contactUs-phone">
            <MDBIcon fas icon="phone-alt" />
            <span> {mobile(contacts?.mobile)}</span>
          </div>
        </MDBAnimation>
        <MDBAnimation
          reveal
          type="fadeIn"
          duration="1000ms"
          delay="500ms"
          className="subscriber-contactUs-middleSide"
        >
          <div className="subscriber-contactUs-branches-container">
            <p>Branches</p>
            <div className="subscriber-contactUs-branches">
              {branches.map((branch, index) => {
                const { name, contacts = {} } = branch;
                return (
                  <div
                    className="subscriber-contactUs-branch-wrapper"
                    key={index}
                  >
                    <div className="subscriber-contactUs-branch-line">
                      <span
                        className="subscriber-contactUs-branch-name"
                        title="Click to view location on the map"
                        onClick={() => handleBranchClick(branch)}
                      >
                        {name}
                      </span>

                      <i className="fas fa-chevron-right subscriber-contactUs-arrow subscriber-contactUs-main"></i>
                    </div>
                    <div className="subscriber-contactUs-branchInfo">
                      <span>{contacts?.person}</span>
                      <span>{mobile(contacts?.mobile)}</span>
                      <span>{contacts?.email}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MDBAnimation>

        <MDBAnimation
          reveal
          type="fadeIn"
          duration="1000ms"
          delay="1000ms"
          className="subscriber-contactUs-rightSide"
        >
          <div style={{ height: "100%", width: "100%" }}>
            <Map
              center={coordinates}
              zoom={16}
              ref={mapRef}
              style={{ height: "100%", width: "100%", borderRadius: "5px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordinates}>
                <Popup>
                  Pinoy iMD — Labanos Compound, Gulod street, barangay San
                  pedro, General Tinio(Papaya)
                </Popup>
              </Marker>
            </Map>
          </div>
        </MDBAnimation>
      </div>
    </section>
  );
}
