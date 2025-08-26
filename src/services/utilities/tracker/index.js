import store from "../../redux/store";
import { BROWSE as FetchTracker } from "../../redux/slices/tracker";
import {
  IDB_BROWSE as IDB_TRACKER_BROWSE,
  IDB_SAVE as IDB_TRACKER_SAVE,
} from "../../indexDB/tracker";

function extractActionData(action) {
  let current = action?.payload;

  while (current && typeof current === "object" && "payload" in current) {
    current = current.payload;
  }

  // Kung wala talagang laman, tingnan ang key na 'data'
  if (
    current === undefined ||
    (Array.isArray(current) && current.length === 0) ||
    (current &&
      typeof current === "object" &&
      Object.keys(current).length === 0)
  ) {
    return action?.payload?.data || [];
  }

  return current;
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
  const { params = {}, token, trackerKey } = config;
  const idbTracker = await IDB_TRACKER_BROWSE();
  const idbDatas = await idb.BROWSE();
  const mdbId = mdbTracker?.[trackerKey]?.id;
  const idbId = idbTracker?.[trackerKey]?.id;
  var shouldFetch = false;
  if (idbDatas.length === 0) shouldFetch = true;
  else if (mdbId !== idbId) shouldFetch = true;

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
            isTracker: true,
            ...params,
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
        console.log("payload", extractActionData(action), trackerKey);
        idb.SAVE(extractActionData(action));
        const menus = await idb.BROWSE();
        store.dispatch(redux?.SetCOLLECTIONS(menus));
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

const getMDB_TRACKER = async (config) => {
  const { branchId, token } = config;
  // const lcTracker = localStorage.getItem(`tracker-${branchId}`);

  // if (lcTracker) {
  //   return JSON.parse(lcTracker);
  // }

  const action = await store.dispatch(
    FetchTracker({ token, params: { branchId } })
  );
  const mdbTracker = action?.payload?.payload || {};

  // if (mdbTracker?._id) {
  //   localStorage.setItem(`tracker-${branchId}`, JSON.stringify(mdbTracker));
  // }

  return mdbTracker;
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
      branchId: "", // this required is for query of tracker
      token: "",
      trackerKey: "",
      paramsKey: "", //example value:(key,keys,params)
      params: {}, // additional params if needed for the request
    },
  }) => {
    const mdbTracker = await getMDB_TRACKER(config);
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
