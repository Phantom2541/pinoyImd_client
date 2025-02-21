import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import TopHeader from "../../../../components/topHeader";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/assets/procurements";
import { dateFormat } from "../../../../services/utilities";
import TableLoading from "../../../../components/tableLoading";

const Equipments = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ procurements }) => procurements
    ),
    [equipments, setEquipments] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, key: { branchId: activePlatform.branchId } }));
  }, [activePlatform, dispatch, token]);

  useEffect(() => {
    const arrangeEquipment = [...collections]?.reduce((acc, curr) => {
      const { brand = "", model = "", createdAt } = curr;
      const key = `${brand}-${model}-${dateFormat(createdAt)}`;
      const index = acc.findIndex((item) => item.key === key);

      if (index > -1) {
        acc[index].quantity += 1;
      } else {
        acc.push({ key, ...curr, quantity: 1 });
      }
      return acc;
    }, []);

    setEquipments(arrangeEquipment || []);
  }, [collections]);

  const style = {
    fontWeight: 400,
  };

  return (
    <MDBCard narrow>
      <TopHeader title="Equipment List" />
      <MDBCardBody>
        {isLoading ? (
          <TableLoading />
        ) : (
          <MDBTable>
            <MDBTableHead>
              <tr>
                <th>Brand Name & Model</th>
                <th>Serial No.</th>
                <th>Quantity</th>
                <th>Date of purchase</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {equipments.length > 0 ? (
                equipments.map((equipment, index) => {
                  const {
                    brand = "",
                    serial = "",
                    model = "",
                    createdAt = "",
                    quantity = 0,
                  } = equipment;
                  return (
                    <tr key={index}>
                      <td style={style}>
                        {brand} {model}
                      </td>
                      <td style={style}>{serial}</td>
                      <td style={style}>{quantity}</td>
                      <td style={style}>{dateFormat(createdAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Records.
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default Equipments;
