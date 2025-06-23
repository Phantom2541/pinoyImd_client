import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { DESTROY, SetEDIT, SetFILTER, SetTeam} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Search } from "../../../../../../components/searchables";
import Swal from "sweetalert2";
import { set } from "lodash";
import { fullName, handlePagination, properFullname } from "../../../../../../services/utilities";
import { UPDATE } from "../../../../../../services/redux/slices/assets/companies";
export default function Collapsable({team , _id}) {
  const {token} = useSelector(({ auth }) => auth),
  dispatch = useDispatch();
  const handleUpdate = (item) => dispatch(SetEDIT(item));
  const handleAdd = (item) => dispatch(SetTeam(item));
  const handleRemove = (member) => {
const newTeam = team.filter((t) =>t. userId._id.toString() !== member.userId._id.toString());
    Swal.fire({
      title: `Are you sure you want to untag ${fullName(member.userId.fullName)}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, untag it!",
    }).then((result) => {
    console.log("handleRemove newTeam :", newTeam);

      if (result.isConfirmed) dispatch(UPDATE({ token, data: { _id, team: newTeam  } }));
    });
  }

  
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Role</th>
          <th>PhoneNumber</th>
          <th>Inform</th>
          <th >
          <div className="d-flex align-items-center">
              <span className="mr-2">   Action</span>
            <Search
            collection={team}
            setFiltered={(selected) => dispatch(SetFILTER(selected))}
            placeHolder="search name"
            HaveAction={true}
            reset={() => dispatch(SetFILTER(team))}
            hideButton={false}
            handleAdd={(item) => handleAdd(item)}
            ></Search>
          </div>
            </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {team?.map(( member, index) => {
          // console.log("member:",member,index);
          
        const{ hasInformed, role, userId } =member;
        const{fullName, alias, phoneNumber}=userId

        return (
          <tr key= {index}>
          <td>{++index}</td>
          <td title={properFullname (fullName)}>{alias}</td>
          <td>{role}</td>
          <td>{phoneNumber}</td>
          <td>{hasInformed}</td>
          <td>
          <button
          onClick={() => handleUpdate(member._id)}
          className="btn btn-sm btn-primary"
          style={{borderRadius: "10px", padding: "3.5px 10px"}}
          >
          Update
          </button>
          </td>
          <td>
          <button onClick={() => handleRemove(member)}
            className="btn btn-danger"
            style={{borderRadius: "10px", padding: "3.5px 10px"}}>
            Untag
            
</button>
          </td>
          </tr>
        );
      })}
      </MDBTableBody>
    </MDBTable>
  );
}