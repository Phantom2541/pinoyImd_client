import React from "react";
import { MDBInput } from "mdbreact";

export default function Troupe({ task, setTask }) {
  const { troupe = {} } = task;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTask({
      ...task,
      troupe: {
        ...troupe,
        [name]: value,
      },
    });
  };

  return (
    <>
      <MDBInput
        label="Method"
        name="method"
        type="text"
        value={troupe.method || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Kit"
        name="kit"
        type="text"
        value={troupe.kit || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Lot Number"
        name="lot"
        type="text"
        value={troupe.lot || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Expiry"
        name="expiry"
        type="text"
        value={troupe.expiry || ""}
        onChange={handleChange}
      />
    </>
  );
}
