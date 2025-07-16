import "./style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  billingAddress,
  ENDPOINT,
  fullName,
} from "../../../services/utilities";
import { Quotes } from "../../../services/fakeDb";
import DEFAULT from "../../../assets/iMD.png";
import { MDBAnimation } from "mdbreact";

export default function Doctors() {
  const { details } = useSelector(({ companies }) => companies);
  const [physicians, setPhysicians] = useState([]);

  useEffect(() => {
    const { branches = [] } = details;

    const merged = [...branches].flatMap(({ physicians = [] }) => physicians);

    const unique = Object.values(
      merged.reduce((acc, curr) => {
        const id = curr.user?._id; // fallback in case user is not nested

        if (!acc[id]) {
          acc[id] = curr;
        } else {
          // Prefer the one with isMajor = true
          if (curr.isMajor && !acc[id].isMajor) {
            acc[id] = curr;
          }
        }

        return acc;
      }, {})
    );

    setPhysicians(unique);
  }, [details]);

  return (
    <div>
      <h1 className="subscriber-doctors-title mb-5">Meet Our Doctors</h1>
      <div className="subscriber-doctors-section">
        <div className="subscriber-doctors-img">
          <div className="subscriber-doctors-img-mask"></div>
        </div>

        <MDBAnimation
          reveal
          type="zoomIn"
          duration="1000ms"
          delay="500ms"
          className="subscriber-doctors-carousel-container"
        >
          <Carousel
            autoPlay
            infiniteLoop
            emulateTouch
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            transitionTime={200}
          >
            {physicians.map((physician, index) => {
              const {
                user,
                specialization = "",
                _id,
                quote,
                branch,
              } = physician;
              return (
                <div
                  className="subscriber-doctors-homeSlideStyle"
                  key={`${_id}-${index}`}
                >
                  <div className="subscriber-doctors-homeimageContainerStyle">
                    <img
                      src={`${ENDPOINT}/public/companies/${details?.name}/physicians/${user?.email}/corporate.png`}
                      alt={physician.name}
                      className="subscriber-doctors-homeimageStyle"
                      onError={(e) => {
                        e.target.src = DEFAULT;
                        e.target.classList.add("default");
                      }}
                    />
                  </div>
                  <div className="subscriber-doctors-hometextContainerStyle">
                    <h1>Dr. {fullName(user?.fullName)}</h1>
                    <h5>{specialization || "General Medicine"}</h5>
                    <p>{Quotes.getQuote(quote)}</p>
                    <h6>- {billingAddress(branch?.address, false)}</h6>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </MDBAnimation>
      </div>
    </div>
  );
}
