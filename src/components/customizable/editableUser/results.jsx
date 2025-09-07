import { fullName, getAge, getGenderIcon } from "../../../services/utilities";

const Results = ({ results, handleSelect = () => {} }) => {
  return (
    <ul className="editable-user-results-list">
      {results.map((item, index) => (
        <li
          key={index}
          className="editable-user-result-item"
          onClick={() => handleSelect(item)}
        >
          <div className="holder-result-content">
            <span style={{ fontSize: "1.1rem" }}>
              {getGenderIcon(item?.isMale)}
            </span>
            {fullName(item?.fullName, true, true)} - {getAge(item?.dob)}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Results;
