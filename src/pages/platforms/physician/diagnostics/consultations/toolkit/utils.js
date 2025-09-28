const utils = {
  findNextQn: (activeQn, dir, cluster) => {
    const currentIdx = cluster.findIndex((p) => p.qn === activeQn);
    if (currentIdx === -1) return null;

    let nextIdx = currentIdx + dir;

    // loop habang nasa loob ng array at hindi "confirmed"
    while (
      nextIdx >= 0 &&
      nextIdx < cluster.length &&
      !["confirmed", "done", "halt"].includes(
        cluster[nextIdx]?.status?.toLowerCase().trim()
      )
    ) {
      nextIdx += dir; // lipat ulit depende sa direction
    }

    // kapag out of bounds, wala nang confirmed
    if (nextIdx < 0 || nextIdx >= cluster.length) {
      return null;
    }

    return cluster[nextIdx]; // confirmed na ito
  },
};

export default utils;
