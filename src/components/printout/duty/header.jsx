import Months from "../../../services/fakeDb/calendar/months";

const Header = ({ selected }) => {
  const { isFirstSched, month, year } = selected || {};
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const startDay = isFirstSched ? 1 : 16;
  return (
    <div className="schedule-header-date text-center mb-n3 mt-4">
      <h3>S C H E D U L E</h3>
      <span>
        {Months[month - 1]} {startDay} – {isFirstSched ? 15 : lastDayOfMonth},{" "}
        {year}
      </span>
    </div>
  );
};

export default Header;
