import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

import Services from "./../../../../../../../services/fakeDb/services";
import { handlePagination } from "./../../../../../../../services/utilities";
const Tables = ({ assurances, page, handleEdit, handleDelete }) => {
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
        {handlePagination(assurances, page, maxPage)?.map(
          (assurance, index) => {
            return (
              <tr key={index}>
                <td>{Services.getName(assurance?.serviceId)}</td>
                <td>{assurance?.abnormal}</td>
                <td>{assurance?.high}</td>
                <td>{assurance?.normal}</td>
                {/* <td>{assurance?.createdAt}</td> */}
                <td>
                  {new Date(assurance?.createdAt).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => handleEdit(assurance)}>Edit</button>
                  <button onClick={() => handleDelete(assurance._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
