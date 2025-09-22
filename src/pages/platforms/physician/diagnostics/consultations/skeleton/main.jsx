import "./style.css";

export default function Skeleton({ ehrId }) {
  return (
    <div className="checkup-data-skeleton">
      <div className="checkup-data-skeleton-body d-flex h-100vh align-items-center justify-content-center">
        {!ehrId && (
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
      </div>
      <div className="checkup-data-skeleton-sidebar"></div>
      <div className="checkup-data-skeleton-note"></div>
      <div className="checkup-data-skeleton-case"></div>
    </div>
  );
}
