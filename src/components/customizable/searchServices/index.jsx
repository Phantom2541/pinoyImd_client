import { useState, useMemo } from "react";
import { debounce } from "lodash";
import Services from "../../../services/fakeDb/finance/catalog/services";
import { MDBIcon } from "mdbreact";

const EditableServices = ({
  placeHolder = "Search service...",
  onSelect = () => {},
  emptyLabel = "Click here to select a service",
  displayName = "abbreviation",
}) => {
  const [searchKey, setSearchKey] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((key) => {
        if (!key) return setResults([]);
        const matches = Services.collections.filter(
          ({ name, abbreviation }) =>
            name.toLowerCase().includes(key.toLowerCase()) ||
            (abbreviation &&
              abbreviation.toLowerCase().includes(key.toLowerCase()))
        );
        setResults(matches);
      }, 300),
    []
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchKey(val);
    debouncedSearch(val);
  };

  const handleSelect = (service) => {
    // Prevent duplicates
    if (!selected.find((s) => s.id === service.id)) {
      const newSelected = [...selected, service];
      setSelected(newSelected);
      onSelect(newSelected.map((s) => s.id)); // return array of IDs
    }

    setIsEditing(false);
    setSearchKey("");
    setResults([]);
  };

  const handleRemove = (id) => {
    const newSelected = selected.filter((s) => s.id !== id);
    setSelected(newSelected);
    onSelect(newSelected.map((s) => s.id));
  };

  if (!isEditing) {
    return (
      <div
        className="editable-service-display  d-flex align-items-center"
        style={{ gap: "10px", flexWrap: "wrap", cursor: "pointer" }}
        onClick={() => setIsEditing(true)}
      >
        {selected.length > 0
          ? selected.map((s) => (
              <div
                key={s.id}
                className="selected-service-tag position-relative"
                style={{ marginRight: 5, cursor: "default" }}
                title={s.name}
              >
                {s.abbreviation}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(s.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                    color: "red",
                    fontSize: ".7rem",
                    cursor: "pointer",
                  }}
                >
                  <MDBIcon icon="times" />
                </span>
              </div>
            ))
          : emptyLabel}
      </div>
    );
  }

  return (
    <div className="position-relative">
      <input
        type="text"
        value={searchKey}
        onChange={handleChange}
        placeholder={placeHolder}
        className="editable-user-input w-100"
        autoFocus
      />

      {results.length > 0 && (
        <ul
          className="editable-user-results-list"
          style={{ position: "absolute", zIndex: 10, width: "100%" }}
        >
          {results.map((item) => (
            <li
              key={item.id}
              className="p-1 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item[displayName]} {/* Display abbreviation */}
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && searchKey && (
        <ul className="editable-user-results-list">
          <li className="p-1 text-center">🚫 Service Not Found</li>
        </ul>
      )}
    </div>
  );
};

export default EditableServices;
