import React from "react";
import { useSelector } from "react-redux";
import { Services } from "../../../../../../services/fakeDb";
import { MDBIcon } from "mdbreact";

export default function Table({ name }) {
  const { census, isLoading } = useSelector(({ sales }) => sales);

  const showCapital = name === "menus",
    obj = census[name],
    total = Object.values(obj).reduce((storage, { walkin, referral }) => {
      storage += walkin + referral;

      return storage;
    }, 0);

  return (
    <table className="ledger-table mt-3">
      <thead>
        <tr>
          <th
            colSpan={showCapital ? "3" : "2"}
            className="text-capitalize text-left pl-5"
          >
            {name}
          </th>
          <th colSpan="2">Sources</th>
          <th />
        </tr>
        <tr>
          <th style={{ width: "50px" }}>#</th>
          <th style={{ width: "250px" }} className="text-left">
            Name
          </th>
          {showCapital && <th>Capital</th>}
          <th>Walk-in</th>
          <th>Referral</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(obj).map(
          ([key, { walkin, referral, capital }], index) => {
            const name = isNaN(Number(key)) ? key : Services.getName(key);

            return (
              <tr key={`${name}-${index}`}>
                <td className="text-center">{index + 1}</td>
                <td>{name}</td>
                {showCapital && <td>{capital}</td>}
                <td>{walkin}</td>
                <td>{referral}</td>
                <td>{walkin + referral}</td>
              </tr>
            );
          }
        )}
        <tr>
          <td
            className="ledger-table-signature-wrapper border-none"
            colSpan={showCapital ? "3" : "2"}
          />
          <td className="text-center p-3" colSpan="2">
            total
          </td>
          <td>{isLoading ? <MDBIcon icon="spinner" pulse /> : total}</td>
        </tr>
      </tbody>
    </table>
  );
}
