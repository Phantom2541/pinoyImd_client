import React, { useState } from "react";
import { useReactFlow, Handle, Position } from "react-flow-renderer";
import Swal from "sweetalert2";
import Default from "./../../../../assets/iMD.png";
import { ENDPOINT } from "../../../../services/utilities";
import { MDBIcon } from "mdbreact";

const normalizePosition = (pos) =>
  Array.isArray(pos)
    ? pos
    : typeof pos === "string"
    ? pos.split(" / ").map((p) => p.trim())
    : [];

export default function CustomNode({ data, id }) {
  const { setNodes } = useReactFlow();
  const [isFading, setIsFading] = useState(false);

  const profile = `${ENDPOINT}/public/users/${data?.email}/profile.jpg`;
  const titles = Array.isArray(data.title)
    ? data.title
    : (data.title || "").split(",").map((s) => s.trim());
  const positions = normalizePosition(data.position);
  const isClone = !data.onReturn && positions.length === 1;

  const handleClone = async () => {
    const positions = normalizePosition(data.position);
    if (positions.length === 0) return;

    let selected = positions[0];

    if (positions.length > 1) {
      const result = await Swal.fire({
        title: "Select position to clone",
        input: "select",
        inputOptions: Object.fromEntries(positions.map((p) => [p, p])),
        showCancelButton: true,
      });

      if (!result.isConfirmed || !result.value) return;
      selected = result.value;
    }

    setNodes((prev) => {
      const alreadyCloned = prev.some(
        (n) =>
          n.id !== id &&
          n.data?.email === data.email &&
          normalizePosition(n.data?.position).includes(selected)
      );

      if (alreadyCloned) {
        Swal.fire(
          "Duplicate",
          `"${selected}" has already been cloned.`,
          "warning"
        );
        return prev;
      }

      const clone = {
        id: `${id}-${Math.random().toString(36).substring(2, 9)}`,
        type: "customNode",
        position: {
          x: 200,
          y: 200,
        },
        data: {
          name: data.name,
          title: data.title,
          email: data.email,
          position: [selected],
        },
      };

      return [...prev, clone];
    });
  };

  const handleReturn = () => {
    if (typeof data.onReturn === "function") {
      setIsFading(true);
      setTimeout(() => {
        data.onReturn();
      }, 300);
    }
  };

  const handleDelete = () => {
    setIsFading(true);
    setTimeout(() => {
      setNodes((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  };

  return (
    <div
      className={`orgChart-innerCard ${isFading ? "node-fade-out" : ""}`}
      style={{ position: "relative" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          top: 3,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#007bff",
          borderRadius: "50%",
          width: 18,
          height: 18,
          zIndex: 11,
          border: "3px solid white",
        }}
        isConnectable
      />

      <div className="orgChart-innerCard-image-container">
        {!isClone && (
          <button
            className="orgChart-innerCard-return bg-warning"
            onClick={handleReturn}
          >
            <MDBIcon fas icon="undo" />
          </button>
        )}
        {isClone && (
          <button
            className="orgChart-innerCard-deleteClone bg-danger"
            onClick={handleDelete}
          >
            <MDBIcon fas icon="trash" />
          </button>
        )}
        <button
          onClick={handleClone}
          className="orgChart-innerCard-clone bg-primary"
        >
          <MDBIcon fas icon="clone" />
        </button>
        <img
          className="orgChart-innerCard-image"
          src={profile}
          alt="profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Default;
          }}
        />
      </div>

      <div className="orgChart-innerCard-info">
        <span className="orgChart-innerCard-name">
          {data.name?.toLowerCase() || "No name"}
        </span>
        {titles.length > 0 && (
          <div className="orgChart-innerCard-title-container">
            <span className="orgChart-innerCard-title">
              {titles.join(", ")}
            </span>
          </div>
        )}
        {positions.length > 0 && (
          <div className="orgChart-innerCard-position-container">
            {positions.map((pos, i) => (
              <span className="orgChart-innerCard-position" key={i}>
                {pos}
                {i < positions.length - 1 && " / "}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          bottom: 3,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#007bff",
          borderRadius: "50%",
          width: 18,
          height: 18,
          zIndex: 11,
          border: "3px solid white",
        }}
        isConnectable
      />
    </div>
  );
}
