import utils from "./utils";

const Difference = ({ schedule }) => {
  if (!schedule?.start || !schedule?.end) return null;

  let diff = utils.getDifference(schedule);

  if (diff < 0) diff = 0;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  const isLessThanOneHour = diff < 120;

  return (
    <div className="fw-bold mt-2">
      {isLessThanOneHour ? (
        <span className="text-danger">
          ⚠️ Minimum: 2 hrs (Now: {hours}h {minutes}m)
        </span>
      ) : (
        <>
          Duration:{" "}
          <span className="text-primary">
            {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""}`}{" "}
            {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`}
            {hours === 0 && minutes === 0 && "0 min"}
          </span>
        </>
      )}
    </div>
  );
};

export default Difference;
