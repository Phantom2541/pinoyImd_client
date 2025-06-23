export default function TaskFooter({ task }) {
  const { _id } = task;

  return (
    <div
      style={{ marginTop: "-1.3rem" }}
      className="border-bottom border-right border-left border-black"
    >
      <div className="d-flex justify-content-between align-items-center mx-2 my-1">
        <div className="d-flex align-items-center">
          <span className="grey-text">Task ID:</span>
          <span style={{ fontWeight: 400 }} className="ml-1">
            {_id}
          </span>
        </div>
      </div>
    </div>
  );
}
