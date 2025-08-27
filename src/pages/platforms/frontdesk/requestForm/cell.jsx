import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTest } from "../../../../services/redux/slices/requestForm/requestForm";

export default function Cell({ category, test }) {
  const dispatch = useDispatch();
  const checked = useSelector(
    (state) => state.requestForm.tests[category]?.[test] || false
  );

  return (
    <tr>
      <td className="border-2 border-black px-2 py-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => dispatch(toggleTest({ section: category, test }))}
          />
          <span>{test}</span>
        </label>
      </td>
    </tr>
  );
}
