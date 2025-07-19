import React, { useRef, useState, useEffect } from "react";
import flatOrgData from "./flatCollections";
import "./style.css";
import OrgNode from "./orgNode";
import OrgStorage from "./orgStorage";
import PROFILE from "./../../../../../../assets/female.jpg";
import { Policy } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../../services/redux/slices/assets/persons/personnels";

// ✅ Build tree with only one root node
function buildTree(flatData) {
  const idMap = {};
  let root = null;

  flatData.forEach((item) => {
    if (item.hId !== null) {
      idMap[item.hId] = { ...item, children: [] };
    }
  });

  Object.values(idMap).forEach((item) => {
    const parentHid = item.hId.split("-").slice(0, -1).join("-");
    if (parentHid && idMap[parentHid]) {
      idMap[parentHid].children.push(item);
    } else {
      root = item;
    }
  });

  return root;
}

export default function OrganizationChart() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState({ left: 0, top: 0 });
  const [data, setData] = useState(flatOrgData);
  const dispatch = useDispatch();

  console.log("policy", Policy.collections);

  useEffect(() => {
    dispatch(BROWSE({ token, branchId: activePlatform.branchId })).then(
      (action) => {
        if (action.type === "assets/persons/personnels/fulfilled") {
          const { payload } = action.payload;

          // Get all designation IDs under the Laboratory department
          const labPositionIds =
            Policy.getPositionsByDepartmentName("Laboratory")?.map(
              (pos) => pos.id
            ) || [];

          // Filter personnel assigned to Laboratory positions
          const _personnel = payload?.filter(({ contract }) =>
            labPositionIds.includes(Number(contract?.designation))
          );

          console.log("_personnel (Laboratory only)", _personnel);
        }
      }
    );
  }, [token, activePlatform, dispatch]);

  const handleMouseDown = (e) => {
    const box = e.target.closest(".orgChart-box");
    const container = containerRef.current;

    // If the click is inside a draggable node, don't initiate dragging
    if (box && container.contains(box)) return;

    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setScroll({
      left: container.scrollLeft,
      top: container.scrollTop,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const c = containerRef.current;
    c.scrollLeft = scroll.left - (e.clientX - start.x);
    c.scrollTop = scroll.top - (e.clientY - start.y);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Auto center horizontally
      container.scrollLeft =
        (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = 0;
    }
  }, []);

  const handleMouseUp = () => setDragging(false);

  const handleDragStart = (e, hId) => {
    const d = data.find((i) => i.hId === hId);
    e.dataTransfer.setData("hId", hId ?? "");
    e.dataTransfer.setData("id", d?.name ?? "");
  };

  const getNextSuffix = (siblings) =>
    String(
      Math.max(0, ...siblings.map((d) => +d.hId.split("-").at(-1))) + 1
    ).padStart(2, "0");

  const onDrop = (dragHid, tgtHid, pos, name) => {
    if (dragHid === tgtHid) return;
    const d = data,
      drag = d.find((i) => i.hId === dragHid),
      tgt = d.find((i) => i.hId === tgtHid);

    if (!dragHid) {
      const fromStorage = d.find((i) => !i.hId && i.name === name);
      if (!fromStorage) return;

      const sibs = d.filter(
        (i) =>
          i.hId?.startsWith(tgtHid + "-") &&
          i.hId.split("-").length === tgtHid.split("-").length + 1
      );

      const prefix = tgtHid ? tgtHid : "";
      const newHid = prefix
        ? `${prefix}-${getNextSuffix(sibs)}`
        : getNextSuffix(sibs);

      return setData(
        d.map((i) => (i === fromStorage ? { ...i, hId: newHid } : i))
      );
    }

    if (tgtHid === null) {
      if (d.some((i) => i.hId?.split("-").length === 1))
        return alert("Only one root node is allowed.");
      return setData(d.map((i) => (i.name === name ? { ...i, hId: "01" } : i)));
    }

    if (!drag || !tgt) return;

    const dp = drag.hId.split("-").slice(0, -1).join("-");
    const tp = tgt.hId.split("-").slice(0, -1).join("-");

    if ((pos === "left" || pos === "right") && dp === tp) {
      const sibs = d
        .filter(
          (i) => i.hId?.startsWith(dp + (dp ? "-" : "")) && i.hId !== drag.hId
        )
        .sort((a, b) => a.hId.localeCompare(b.hId));
      const idx = sibs.findIndex((i) => i.hId === tgtHid);
      sibs.splice(pos === "left" ? idx : idx + 1, 0, drag);
      return setData(
        d.map((i) => {
          const found = sibs.indexOf(i);
          if (found === -1) return i;
          const sfx = String(found + 1).padStart(2, "0");
          return { ...i, hId: dp ? `${dp}-${sfx}` : sfx };
        })
      );
    }

    const kids = d.filter(
      (i) =>
        i.hId?.startsWith(tgtHid + "-") &&
        i.hId.split("-").length === tgtHid.split("-").length + 1
    );
    const newHid = `${tgtHid}-${getNextSuffix(kids)}`;
    setData(d.map((i) => (i.hId === dragHid ? { ...i, hId: newHid } : i)));
  };

  const rootNode = buildTree(data.filter((i) => i.hId !== null));
  const storageItems = data.filter((i) => i.hId === null);

  return (
    <>
      <OrgStorage
        storageItems={storageItems}
        onDropToStorage={(draggedName) => {
          setData((prevData) => {
            const draggedNode = prevData.find((i) => i.name === draggedName);
            if (!draggedNode?.hId) return prevData;

            const targetPrefix = draggedNode.hId;
            return prevData.map((item) =>
              item.hId?.startsWith(targetPrefix) ? { ...item, hId: null } : item
            );
          });
        }}
      />

      <div className="orgChart-wrapper">
        <div
          ref={containerRef}
          className="orgChart-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          <div
            className="orgChart-chart"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const draggedHid = e.dataTransfer.getData("hId");
              const draggedName = e.dataTransfer.getData("id");
              if (!rootNode) {
                onDrop(draggedHid, null, "root", draggedName);
              }
            }}
          >
            {!rootNode && (
              <div className="empty-chart-dropzone">
                Drop here to start your Org Chart
              </div>
            )}
            {rootNode && (
              <OrgNode
                key={rootNode.hId}
                node={rootNode}
                onDrop={onDrop}
                onDragStart={handleDragStart}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
