const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  target,
  hoveredNodeId,
  style = {},
}) => {
  const correctedTargetY = style.fixedTargetY ?? targetY;
  const adjustedTargetY = correctedTargetY + (style.fixOffsetY || 20);

  // Compute dynamic vertical line height (from sourceY to just above adjustedTargetY)
  const verticalGap = Math.max(0, adjustedTargetY - sourceY - 30);
  const horizontalY = sourceY + verticalGap;

  const isHovered = hoveredNodeId === source || hoveredNodeId === target;
  const strokeColor = isHovered ? "#1266F1" : "black";

  const path = `
    M ${sourceX},${sourceY}
    L ${sourceX},${horizontalY}
    L ${targetX},${horizontalY}
    L ${targetX},${adjustedTargetY}
  `;

  return (
    <path
      id={id}
      d={path}
      style={{ ...style, stroke: strokeColor }}
      fill="none"
      strokeWidth={2}
    />
  );
};

export default CustomEdge;
