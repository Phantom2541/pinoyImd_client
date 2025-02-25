import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

import Services from "./../../../../../../../services/fakeDb/services";
import { handlePagination } from "./../../../../../../../services/utilities";
const Tables = ({ controls, page, handleEdit, handleDelete }) => {
  const { maxPage } = useSelector(({ auth }) => auth);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>Service ID</th>
          <th>Abnormal</th>
          <th>High</th>
          <th>Normal</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {handlePagination(controls, page, maxPage)?.map((control, index) => {
          return (
            <tr key={index}>
              <td>{Services.getName(control?.serviceId)}</td>
              <td>{control?.abnormal}</td>
              <td>{control?.high}</td>
              <td>{control?.normal}</td>
              {/* <td>{control?.createdAt}</td> */}
              <td>
                {new Date(control?.createdAt).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td>
                <button onClick={() => handleEdit(control)}>Edit</button>
                <button onClick={() => handleDelete(control._id)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
