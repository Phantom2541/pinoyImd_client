const utils = {
  findNextQn: (activeQn, dir, cluster) => {
    const currentIdx = cluster.findIndex((p) => p.qn === activeQn);
    if (currentIdx === -1) return null;
    const fallback = currentIdx + dir;
    if (fallback >= 0) {
      return cluster[fallback];
    }

    return null;
  },
};

export default utils;
