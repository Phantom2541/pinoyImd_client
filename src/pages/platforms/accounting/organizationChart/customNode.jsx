import React, { useEffect, useState } from "react";
import { useReactFlow, Handle, Position } from "react-flow-renderer";
import Swal from "sweetalert2";
import Default from "./../../../../assets/iMD.png";
// import Default from "./../../../../../../assets/iMD.png";
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

  const handleClone = async () => {
    const positions = normalizePosition(data.position);
    if (positions.length < 2) return;

    const { value: selected } = await Swal.fire({
      title: "Select position to clone",
      input: "select",
      inputOptions: Object.fromEntries(positions.map((p) => [p, p])),
      showCancelButton: true,
    });

    if (!selected) return;

    setNodes((prev) => {
      const current = prev.find((n) => n.id === id);
      if (!current) return prev;

      const updated = {
        ...current,
        data: {
          ...current.data,
          position: positions.filter((p) => p !== selected),
        },
      };

      const clone = {
        ...updated,
        id: `${id}-${Math.random().toString(36).substring(2, 9)}`,
        position: {
          x: current.position.x + 100,
          y: current.position.y + 100,
        },
        data: {
          ...updated.data,
          position: [selected],
        },
      };

      return prev
        .map((node) => (node.id === id ? updated : node))
        .concat(clone);
    });
  };

  const profile = `${ENDPOINT}/public/users/${data?.email}/profile.jpg`;

  useEffect(() => {
    console.log("Profile image URL:", profile);
  }, [profile]);

  const titles = Array.isArray(data.title)
    ? data.title
    : (data.title || "").split(",").map((s) => s.trim());
  const positions = normalizePosition(data.position);

  const handleReturn = () => {
    if (typeof data.onReturn === "function") {
      setIsFading(true); // 🔸 Start fade-out animation
      setTimeout(() => {
        data.onReturn(); // ✅ Actually remove after 300ms
      }, 300); // Match your CSS transition duration
    }
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
          width: 12,
          height: 12,
          zIndex: 11,
        }}
        isConnectable
      />
      <button
        className="orgChart-innerCard-return bg-warning"
        onClick={handleReturn}
      >
        <MDBIcon fas icon="undo" />
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
        {positions.length > 1 && (
          <button onClick={handleClone} className="orgChart-innerCard-cloneBtn">
            Clone
          </button>
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
          width: 12,
          height: 12,
          zIndex: 11,
        }}
        isConnectable
      />
    </div>
  );
}
