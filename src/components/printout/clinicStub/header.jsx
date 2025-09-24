export default function Header({ date, dealId, appointment = {} }) {
  const { clinic = {} } = appointment;
  return (
    <>
      <h4
        onClick={() => {
          window.print();
          window.close();
        }}
        style={{ marginBottom: -5 }}
        className="fw-bold"
      >
        {clinic?.code}
      </h4>
      <h6 className="mb-0">{clinic?.title}</h6>

      <small className="fw-bold">
        {new Date(date).toDateString()}, {new Date(date).toLocaleTimeString()}
      </small>

      <div
        style={{
          border: "1px dashed #000",
          borderRadius: "5px",
          padding: "10px",
          position: "relative",
          marginTop: "7.5px",
        }}
      >
        <small
          style={{
            position: "absolute",
            fontWeight: "bold",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#eee",
            padding: "0 7.5px",
          }}
        >
          Transaction ID
        </small>
        {dealId}
      </div>
    </>
  );
}
