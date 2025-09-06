const fetchTracker = {
  hasLoaded: (entity) => {
    const _fetchedFlags = JSON.parse(
      localStorage.getItem("fetchedTracker" || "{}")
    );
    return _fetchedFlags[entity];
  },
  setLoaded: (entity) => {
    const _fetchedFlags = JSON.parse(
      localStorage.getItem("fetchedTracker" || "{}")
    );
    _fetchedFlags[entity] = true;
    localStorage.setItem("fetchedTracker", JSON.stringify(_fetchedFlags));
  },
  reset: () => {
    localStorage.setItem(
      "fetchedTracker",
      JSON.stringify({ deals: false, onboardings: false, tasks: false })
    );
  },

  get: {
    timeZone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    lastFetchCreatedAt: (collections) => {
      if (!collections.length) return new Date();
      return collections.reduce((prev, curr) =>
        new Date(curr.updatedAt) > new Date(prev.updatedAt) ? curr : prev
      )?.updatedAt;
    },
    formattedDate: (_date = null, hasTime = false) => {
      const date = _date ? new Date(_date) : new Date();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (hasTime) {
        const dtf = new Intl.DateTimeFormat("en-CA", {
          timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // 24-hour format
        });

        const parts = dtf.formatToParts(date);
        const obj = {};
        parts.forEach(({ type, value }) => (obj[type] = value));
        const ms = String(date.getMilliseconds()).padStart(3, "0");
        return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:${obj.second}.${ms}`;
      } else {
        return new Intl.DateTimeFormat("en-CA", {
          timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      }
    },
  },
  roomID: () => {
    const lcAP = localStorage.getItem("activePlatform");
    if (!lcAP) return "";
    if (lcAP) {
      const { branchId = "" } = JSON.parse(lcAP);
      return branchId;
    }
  },
};

export default fetchTracker;
