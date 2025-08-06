const Patient = ({ data, onChange }) => (
  <table className="w-full">
    <tbody>
      <tr>
        <td className="pr-4 py-2 font-medium">Patient Name</td>
        <td>
          <input
            className="w-full"
            type="text"
            name="name"
            value={data.name || ""}
            onChange={onChange}
          />
        </td>
      </tr>
      <tr>
        <td className="pr-4 py-2 font-medium">Date of Birth</td>
        <td>
          <input
            className="w-full"
            type="date"
            name="dob"
            value={data.dob || ""}
            onChange={onChange}
          />
        </td>
      </tr>
      <tr>
        <td className="pr-4 py-2 font-medium">Contact Number</td>
        <td>
          <input
            className="w-full"
            type="text"
            name="contact"
            value={data.contact || ""}
            onChange={onChange}
          />
        </td>
      </tr>
    </tbody>
  </table>
);

export default Patient;
