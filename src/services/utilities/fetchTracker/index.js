const fetchTracker = {
  hasLoaded: (entity) => {
    const _fetchedFlags = JSON.parse(
      localStorage.getItem("fetchedFlags" || "{}")
    );
    return _fetchedFlags[entity];
  },
  setLoaded: (entity) => {
    const _fetchedFlags = JSON.parse(
      localStorage.getItem("fetchedFlags" || "{}")
    );
    _fetchedFlags[entity] = true;
    localStorage.setItem("fetchedFlags", JSON.stringify(_fetchedFlags));
  },
  reset: () => {
    localStorage.setItem(
      "fetchedFlags",
      JSON.stringify({ deals: false, onboardings: false, tasks: false })
    );
  },
};

export default fetchTracker;
