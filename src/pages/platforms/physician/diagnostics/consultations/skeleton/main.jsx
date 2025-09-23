import "./style.css";

export default function Skeleton({ ehrId, isDone = false, schedule }) {
  return (
    <div className="checkup-data-skeleton">
      <div className="checkup-data-skeleton-body d-flex h-100vh align-items-center justify-content-center">
        {!ehrId && !isDone && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: "2rem",
              height: "60vh",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#b71c1c",
              textAlign: "center",
              padding: "0 1rem",
              borderRadius: "10px",
            }}
          >
            ⚠️ Please go to the appointments page first and select at least one
            patient.
          </div>
        )}

        {isDone && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1b5e20",
              textAlign: "center",
              padding: "1rem",
              border: "2px solid #1b5e20",
              borderRadius: "10px",
              backgroundColor: "#e8f5e9",
              maxWidth: "600px",
            }}
          >
            ✅ Checkup for schedule{" "}
            <span style={{ fontWeight: "700" }}>{schedule}</span>
            has been completed.
            <br />
            There are no more appointments for this schedule.
          </div>
        )}
      </div>
      <div className="checkup-data-skeleton-sidebar"></div>
      <div className="checkup-data-skeleton-note"></div>
      <div className="checkup-data-skeleton-case"></div>
    </div>
  );
}
