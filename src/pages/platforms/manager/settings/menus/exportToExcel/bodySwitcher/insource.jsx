import { MDBTypography } from "mdbreact";
import { useSelector } from "react-redux";
import { Memberships } from "../../../../../../../services/fakeDb";
const contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};
const Insource = ({ form, setForm }) => {
  const { collections: insources } = useSelector(({ providers }) => providers);
  const isMembership = form.menuType === "mbs";

  const handleChange = (value) => {
    const insource = insources.find(({ _id }) => _id === value);
    const { membership, contract } = insource || {};
    setForm({
      ...form,
      insource: {
        ...insource?.clients,
        membership,
        contract,
        providerID: insource?._id,
      },
    });
  };

  return (
    <>
      <MDBTypography
        noteTitle="Tip: "
        note
        noteColor="primary"
        className="mt-4"
      >
        Select a {isMembership ? "membership" : "contract"} to include
      </MDBTypography>
      <select
        className="form-control"
        value={form?.insource?.providerID}
        onChange={({ target }) => handleChange(target.value)}
      >
        <option value={""}>
          Select a {isMembership ? "membership" : "contract"}
        </option>
        {insources
          .filter(({ category }) => category === form?.menuType)
          .map(({ clients, membership, _id, contract }) => (
            <option key={_id} value={_id}>
              {Memberships.getEmoji(membership)}
              {clients?.name || clients?.displayname}
              {!isMembership && ` - ${contracts[contract]}`}
            </option>
          ))}
      </select>
    </>
  );
};

export default Insource;
