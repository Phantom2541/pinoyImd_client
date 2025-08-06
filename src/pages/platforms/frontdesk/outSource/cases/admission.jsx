const Admission = ({ data, onChange }) => (
  <table className="w-full">
    <tbody>
      <tr>
        <td className="pr-4 py-2 font-medium">Admission Date/Time</td>
        <td>
          <input
            className="w-full"
            type="datetime-local"
            name="admissionTime"
            value={data.admissionTime || ""}
            onChange={onChange}
          />
        </td>
      </tr>
      <tr>
        <td className="pr-4 py-2 font-medium">Type of Admission</td>
        <td>
          <select
            className="w-full"
            name="admissionType"
            value={data.admissionType || ""}
            onChange={onChange}
          >
            <option value="">Select Type</option>
            <option value="emergency">Emergency</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </td>
      </tr>
      <tr>
        <td className="pr-4 py-2 font-medium">Attending Physician</td>
        <td>
          <input
            className="w-full"
            type="text"
            name="physician"
            value={data.physician || ""}
            onChange={onChange}
          />
        </td>
      </tr>
    </tbody>
  </table>
);

export default Admission;
