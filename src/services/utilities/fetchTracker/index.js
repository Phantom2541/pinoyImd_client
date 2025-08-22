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
};

export default fetchTracker;
