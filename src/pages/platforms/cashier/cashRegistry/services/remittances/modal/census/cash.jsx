import { currency } from "../../../../../../../../services/utilities";

export default function Cash({ breakdown, gross }) {
  return (
    <div className="mr-2">
      <div className="mb-2">
        <strong>Payment Categories</strong>
        <hr />
      </div>

      {Object.entries(breakdown).map(([key, value], idx) => {
        console.log(key, value);

        return (
          <label key={idx} className="d-block mb-1 mr-1">
            <span>{key}</span>
            <b className="float-right">{currency.format(value) || 0}</b>
          </label>
        );
      })}
      <hr />
      <strong>Total Gross: {currency.format(gross)}</strong>
    </div>
  );
}
