const Result = ({ form, index, obj }) => {
  const { department = [] } = obj;
  const dept = department[0] || "";
  return (
    <tr>
      <td>{dept}</td>
      <td>{form}</td>
    </tr>
  );
};

export default Result;
