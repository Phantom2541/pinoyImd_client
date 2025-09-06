import store from "../../redux/store";
import {
  IDB_BROWSE as IDB_TRACKER_BROWSE,
  IDB_SAVE as IDB_TRACKER_SAVE,
} from "../../indexDB/tracker";

function extractActionData(action) {
  let current = action?.payload;

  // Traverse down habang may `payload`
  while (current && current.payload !== undefined) {
    current = current.payload;
  }

  // Priority 1: last payload na array
  if (Array.isArray(current) && current.length > 0) {
    return current;
  }

  // Priority 2: data key kung array
  if (Array.isArray(current?.data) && current.data.length > 0) {
    return current.data;
  }

  // Fallback: empty array
  return [];
}

const fetchDatas = async ({
  config = {},
  mdbTracker,
  redux = {
    BROWSE: () => {},
    SetCOLLECTIONS: () => {},
  },
  idb = {
    BROWSE: () => {},
    SAVE: () => {},
  },
}) => {
  const { token, trackerKey = "" } = config;
  const idbTracker = await IDB_TRACKER_BROWSE();
  const idbDatas = await idb.BROWSE();
  const mdbId = mdbTracker?.[trackerKey]?.id || "";
  const idbId = idbTracker?.[trackerKey]?.id || "";
  var shouldFetch = false;
  if (idbDatas?.length === 0) shouldFetch = true;
  if (mdbId !== idbId) shouldFetch = true;

  //IF WE HAVE A DATAS IN THE INDEXDB AND WE HAVE A MDBTRACKER GET ALL MENU FROM THE LAST DATA IN THE INDEXDB AND FROM THE MDBTRACKER
  const latestIdbUpdatedAt = idbDatas?.reduce((latest, m) => {
    return m.updatedAt > latest ? m.updatedAt : latest;
  }, idbDatas[0]?.updatedAt);

  if (shouldFetch) {
    const idbTrackerUpdatedAt = idbTracker?.[trackerKey]?.updatedAt || "";
    const mdbTrackerUpdatedAt = mdbTracker?.[trackerKey]?.updatedAt || "";

    store
      .dispatch(
        redux.BROWSE({
          token,
          [config?.paramsKey || "key"]: {
            ...config?.params,
            isTracker: true,
            ...(idbDatas?.length > 0 && idbId > -1
              ? {
                  startDate: idbTrackerUpdatedAt || mdbTrackerUpdatedAt,
                  endDate: mdbTrackerUpdatedAt || "",
                }
              : {
                  startDate: latestIdbUpdatedAt,
                  endDate: mdbTrackerUpdatedAt,
                }),
          },
        })
      )
      .then(async (action) => {
        idb.SAVE(extractActionData(action));
        const collections = await idb.BROWSE();
        store.dispatch(redux?.SetCOLLECTIONS(collections));
      });
  } else {
    store.dispatch(redux?.SetCOLLECTIONS(idbDatas));
  }

  if (mdbTracker?._id && mdbTracker[trackerKey]) {
    IDB_TRACKER_SAVE({
      [trackerKey]: mdbTracker[trackerKey],
      branch: mdbTracker?.branch,
    });
  }
};

const getMDB_TRACKER = (config) => {
  const { branchId } = config;
  var tracker = {};
  const lcTracker = localStorage.getItem(`tracker-${branchId}`);

  if (lcTracker) {
    tracker = JSON.parse(lcTracker);
  }
  if (tracker?._id) {
    localStorage.setItem(`tracker-${branchId}`, JSON.stringify(tracker));
  }
  return tracker;
};

const Tracker = {
  /**
   * Initializes the tracker by fetching data from the backend and saving it to
   * IndexedDB and localStorage. It also updates the Redux store with the latest data.
   *
   * @param {Object} redux - Redux actions for fetching and updating collections.
   *   - BROWSE: function to fetch data from the backend.
   *     **Important:**
   *       - The backend request sent by `BROWSE` should include `startDate` and `endDate`
   *         to ensure accurate and complete data retrieval.
   *       - The parameters must be passed inside an object named `key`, because the
   *         BROWSE thunk destructures its argument like `{ token, key }`.
   *         Example:
   *           redux.BROWSE({ token, key: { branchId, startDate, endDate } })
   *   - SetCOLLECTIONS: function to update the Redux store with fetched data.
   *
   * @param {Object} idb - IndexedDB utilities for browsing and saving data.
   *   - BROWSE: function to read data from IndexedDB.
   *   - SAVE: function to save data to IndexedDB.
   *
   * @param {Object} config - Configuration object for the tracker.
   *   - branchId: The ID of the branch to fetch tracker data for.
   *   - token: Authorization token for API requests.
   *   - trackerKey: The key in the tracker object to track (e.g., "menu").
   */
  initialize: async ({
    redux = {
      BROWSE: () => {},
      SetCOLLECTIONS: () => {},
    },
    idb = {
      BROWSE: () => {},
      SAVE: () => {},
    },
    config = {
      branchId: "",
      token: "",
      trackerKey: "",
      paramsKey: "",
      params: {},
    },
  }) => {
    const mdbTracker = getMDB_TRACKER(config);
    await fetchDatas({
      mdbTracker: mdbTracker,
      redux,
      idb,
      config,
    });
  },
  set: (updatedTracker) => {
    // Save the updated tracker object to localStorage
    localStorage.setItem(
      `tracker-${updatedTracker.branch}`,
      JSON.stringify(updatedTracker)
    );
  },
};

export default Tracker;
