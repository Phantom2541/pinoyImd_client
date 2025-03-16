import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { ENDPOINT, PresetUser } from "../../../../services/utilities";
import Modal from "./modal";

export default function CompanyCard({
  company = {},
  _key = "",
  isFavorite = false,
  setFavorite = () => {},
  placeholder = false,
}) {
  const [shakeBell, setShakeBell] = useState(false),
    [show, setShow] = useState(false);

  const { name, subName = "", _id } = company;

  useEffect(() => {
    if (shakeBell) setTimeout(() => setShakeBell(false), 550);
  }, [shakeBell]);

  const toggleBell = () => {
    if (!isFavorite) setShakeBell(true);
    setFavorite(_id);
  };

  return (
    <MDBCard key={_key}>
      <MDBCardImage
        position="top"
        alt={name}
        src={`${ENDPOINT}/public/credentials/${name}/logo.jpg`}
        onError={(e) => (e.target.src = PresetUser)}
        className="mx-auto"
        style={{
          height: "200px",
          width: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
      <MDBCardBody>
        <MDBCardTitle title={name} className="text-truncate">
          {name}
        </MDBCardTitle>
        <MDBCardText
          title={subName}
          className={`text-truncate ${!subName && "text-white"}`}
        >
          {subName || "placeholder"}
        </MDBCardText>
      </MDBCardBody>
      {!placeholder && (
        <MDBCardBody className="d-flex">
          <MDBBtn
            color="primary"
            size="sm"
            className="w-75"
            onClick={() => setShow(true)}
          >
            Apply
          </MDBBtn>
          <MDBBtn
            // onClick={toggleBell}
            color={isFavorite ? "primary" : "grey"}
            size="sm"
            outline
          >
            <MDBIcon className={`${shakeBell && "bell-shake"}`} icon="bell" />
          </MDBBtn>
        </MDBCardBody>
      )}
      <Modal show={show} toggle={() => setShow(!show)} selected={company} />
    </MDBCard>
  );
}
