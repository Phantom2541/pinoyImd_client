import { useState } from "react";
import { useReactFlow, Handle, Position } from "react-flow-renderer";
import Swal from "sweetalert2";
import Default from "./../../../../assets/iMD.png";
import { Cloudinary, properFullname } from "../../../../services/utilities";
import { MDBIcon } from "mdbreact";
import { v4 as uuidv4 } from "uuid";

export default function CustomNode({ data, id, setAvailableNodes }) {
  const { setNodes, setEdges } = useReactFlow();
  const [isFading, setIsFading] = useState(false);
  const { eid } = data;
  const isClone = data.isClone;
  const handleClone = async () => {
    setNodes((prev) => {
      const isAlreadyClone = prev.some(
        (n) => n.data.isClone && n.data.eid._id === eid._id
      ); //to determine if we have a already clone

      if (isAlreadyClone) {
        Swal.fire(
          "Duplicate",
          `"${properFullname(eid.fullName)}" has already been cloned.`,
          "warning"
        );
        return prev;
      }

      const clone = {
        id: uuidv4(),
        type: "customNode",
        position: {
          x: 200,
          y: 200,
        },
        data: {
          ...data,
          isClone: true,
        },
      };

      return [...prev, clone];
    });
  };

  const handleReturn = () => {
    setIsFading(true);
    setTimeout(() => {
      var _nodes = []; //copy of updated nodes
      var deletedNode = {};
      setNodes((prev) => {
        const _prev = [...prev];
        const index = _prev.findIndex((n) => n.id === id);
        deletedNode = _prev[index];
        _prev.splice(index, 1);
        _nodes = _prev;
        return _prev;
      });

      setEdges((prev) => {
        const _prev = [...prev].filter((edge) => {
          const isExist = (key) =>
            _nodes.some(({ id: nodeID }) => nodeID === edge[key]);
          const sourceExist = isExist("source");
          const targetExist = isExist("target");
          return sourceExist && targetExist;
        });
        return _prev;
      });

      setAvailableNodes((prev) => [deletedNode, ...prev]);
    }, 300);
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
          src={`${Cloudinary.getEndpoint()}/users/${eid?.email}/profile.png`}
          alt="profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Default;
          }}
        />
      </div>
      <div className="orgChart-innerCard-info">
        <span className="orgChart-innerCard-name">
          {properFullname(eid?.fullName)}
        </span>
        {eid?.fullName?.postnominal && (
          <div className="orgChart-innerCard-title-container">
            <span className="orgChart-innerCard-title">
              {eid?.fullName?.postnominal}
            </span>
          </div>
        )}
        <div className="orgChart-innerCard-position-container">
          <span className="orgChart-innerCard-position">
            {data?.position || ""}
          </span>
        </div>
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
