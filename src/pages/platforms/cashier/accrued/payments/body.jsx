import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../services/redux/slices/finance/payments";
import Swal from "sweetalert2";
import { Statements } from "../../../../../services/fakeDb";
const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ payments }) => payments),
    dispatch = useDispatch();

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };


  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th style={{ height: "20px" }}>#</th>
          <th>Name</th>
          <th colSpan={3}>Deduction</th>
          <th colSpan={4}>Earnings</th>
          <th>Net</th>
          <th>Created At</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th>Cash on Advance</th>
          <th>Absent</th>
          <th>Loan</th>
          <th>Holiday</th>
          <th>Rate</th>
          <th>Cola</th>
          <th>Overtime</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {!filtered.length && (
          <tr>
            <td colSpan={12} style={{ textAlign: "center" }}>
              No Data
            </td>
          </tr>
        )}
        {filtered.map(
          ({ _id, fsId, breakdown, createdAt, ...payment }, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{Statements.getName(fsId)}</td>
              <td>{breakdown?.deduction?.ca}</td>
              <td>{breakdown?.deduction?.absent}</td>
              <td>{breakdown?.deduction?.loan}</td>
              <td>{breakdown?.earn?.holiday}</td>
              <td>{breakdown?.earn?.rate}</td>
              <td>{breakdown?.earn?.cola}</td>
              <td>{breakdown?.earn?.overtime}</td>
              <td>{breakdown?.net}</td>
              <td>
                {new Date(createdAt).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </td>
            </tr>
          )
        )}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
