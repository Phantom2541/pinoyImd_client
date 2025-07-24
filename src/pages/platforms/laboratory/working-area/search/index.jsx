import "./search.css";
import { MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Barcode } from "../../../../../services/utilities";
import { useEffect, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { Templates } from "../../../../../services/fakeDb";
import { SetWorkArea } from "../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function Search() {
  const {
      filteredStatus,
      byGroup: groupBy,
      showWorkArea,
    } = useSelector(({ validator }) => validator),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const timeoutRef = useRef(null);
  const inputRef = useRef(null); // ref for input

  // Focus input on mount and every re-render
  useEffect(() => {
    inputRef.current?.focus();
  }, [showWorkArea]);

  const handleChange = (_search) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const [abbrSec, pn] = _search.split("-");
      const result = filteredStatus.find((task) => {
        const { diagnostic = {}, customerId } = task;
        const diagnostics = Object.entries(diagnostic);
        return diagnostics.some(([section, value]) => {
          return [value]
            .flat(Infinity)
            .some(
              ({ pn }) =>
                Barcode.getValue(
                  groupBy === "all" ? section : groupBy,
                  customerId,
                  pn
                )?.toLowerCase() === _search?.toLowerCase()
            );
        });
      });

      if (!result?._id) {
        addToast("No matching patient found for the scanned barcode", {
          appearance: "warning",
        });
      } else {
        const section = Templates.getComponentByAbbr(abbrSec);
        const { diagnostic } = result;
        const diagnostics = [diagnostic[section]];
        const task = [...diagnostics]
          .flat(Infinity)
          .find(({ pn: p }) => Number(p) === Number(pn));

        dispatch(SetWorkArea({ ...result, task, section, pi: _search })); //pi = patient identifier
      }

      if (inputRef.current) inputRef.current.value = "";
    }, 10);
  };

  return (
    <div className="d-flex align-items-center transition-all">
      <div className="working-area-search-container">
        <MDBIcon className="working-area-search-icon" fas icon="search" />
        <input
          ref={inputRef} // use ref here
          placeholder="Search..."
          onChange={({ target }) => handleChange(target.value)}
          autoCorrect="off"
          className="working-area-search"
          type="search"
          id="working-area-search"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
