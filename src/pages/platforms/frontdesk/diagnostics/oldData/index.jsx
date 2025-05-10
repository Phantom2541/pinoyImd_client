import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBSpinner, MDBTable } from "mdbreact";

import {
  HUNDREDDATA,
  UPDATE100DATA,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName, harvestTask } from "../../../../../services/utilities";
import { Services, Templates } from "../../../../../services/fakeDb";
export default function OldData() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ deals }) => deals),
    [deals, setDeals] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform.department) {
      dispatch(
        HUNDREDDATA({ token, key: { department: activePlatform.department } })
      );
    }
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    const records = collections?.map((sale) => {
      const { _id, ssx, createdAt, rendered = [], cart, customerId } = sale;
      const packages = cart?.map((s) => s.packages)?.flat();

      const department = Services.getDepartment(packages);
      console.log("department", department);
      const task = harvestTask(sale?.cart);
      const formIndices = Templates.getComponentIndices(Object.keys(task));

      return {
        _id,
        customerId,
        department,
        cart,
        ssx,
        rendered: [
          ...rendered,
          {
            dept: department,
            by: auth._id,
            at: new Date().toLocaleString(),
          },
        ],
        forms: formIndices,
        createdAt,
      };
    });
    setDeals(records);
  }, [collections, activePlatform, auth]);

  const generateTask = async () => {
    const data = deals
      .filter(({ department }) => department.length > 0)
      .map(({ _id, department, forms }) => ({
        _id,
        department,
        forms,
      }));
    // console.log("data", data);?

    dispatch(
      UPDATE100DATA({
        token,
        data,
      })
    );
  };

  return (
    <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
      <div className="text-center mt-5">
        {collections?.length > 0 ? (
          <MDBTable responsive hover bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>client</th>
                <th>services</th>
                <th>department</th>
                <th>forms</th>
                <th>date</th>
                <th>_id</th>
              </tr>
            </thead>
            <tbody>
              {deals?.map((item, index) => (
                <tr key={index}>
                  <td key={index}>{index++}</td>
                  <td>{fullName(item?.customerId?.fullName)}</td>
                  <td>{item?.cart?.map((s) => s.abbreviation).join(", ")} </td>
                  <td>{JSON.stringify(item.department)}</td>
                  <td>{JSON.stringify(item?.forms)} </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item._id}</td>
                </tr>
              ))}
            </tbody>
          </MDBTable>
        ) : (
          <MDBSpinner />
        )}
        <button onClick={() => generateTask()}>Generate</button>
      </div>
    </MDBCard>
  );
}
