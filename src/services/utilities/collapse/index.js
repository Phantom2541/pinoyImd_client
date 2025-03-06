const collapse = {
  getStyle: (index = -1, activeId = -1, didHoverId = -1) => {
    if (index < -1 || activeId < -1) return "index and activeID is required!";

    const color =
      activeId !== index
        ? didHoverId === index
          ? "text-primary"
          : "text-black"
        : "text-white";
    const border =
      activeId === index
        ? " bg-info transition"
        : didHoverId === index
        ? "rounded border border-info bg-transparent ease-out"
        : "bg-transparent ease-out";

    return { border, color };
  },
};

export default collapse;
