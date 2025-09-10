import { MDBIcon } from "mdbreact";

const Badge = ({ isCompleted = false, isValid = true, radius = true }) => {
  return (
    <>
      {isCompleted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            zIndex: 2,
            right: 0,
            width: "35px",
            height: "35px",
            backgroundColor: isValid ? "#f59e0b" : "red",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            borderBottomLeftRadius: "100%",
            ...(radius && { borderTopRightRadius: "10px" }),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <MDBIcon
            icon={isValid ? "check" : "times"}
            className="mt-n1 mr-n1"
            style={{ fontSize: "16px", lineHeight: "1" }}
          />
        </div>
      )}
    </>
  );
};

export default Badge;
