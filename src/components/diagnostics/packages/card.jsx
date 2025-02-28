const PackageCard = ({ package: { name, price, description } }) => (
  <MDBCard className="my-3">
    <MDBCardBody>
      <MDBCardTitle>{name}</MDBCardTitle>
      <MDBCardText>{description}</MDBCardText>
      <MDBCardText className="font-weight-bold">₱ {price}</MDBCardText>
    </MDBCardBody>
  </MDBCard>
);

export default PackageCard;
