import { MDBCol, MDBInput, MDBRow } from "mdbreact";

const Basic = ({ info, setInfo = () => {} }) => {
  return (
    <MDBRow>
      <MDBCol>
        <MDBInput
          required
          label="Price"
          type="number"
          value={String(info.price)}
          onChange={(e) => setInfo({ ...info, price: Number(e.target.value) })}
        />
      </MDBCol>
      <MDBCol>
        <MDBInput
          label="Cost"
          type="number"
          required
          value={String(info.price)}
          onChange={(e) => setInfo({ ...info, price: Number(e.target.value) })}
        />
      </MDBCol>
      <MDBCol>
        <MDBInput
          label="Stock"
          type="number"
          required
          value={String(info.price)}
          onChange={(e) => setInfo({ ...info, price: Number(e.target.value) })}
        />
      </MDBCol>
    </MDBRow>
  );
};

export default Basic;
