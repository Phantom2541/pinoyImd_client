// onboardingsIndexedDB.js
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const DB_NAME = `Onboardings-${today}`;

// Generate store name dynamically based on user & branch
const getStoreName = () => {
  const activePlatform = JSON.parse(
    localStorage.getItem("activePlatform") || "{}"
  );
  const { branch = {} } = activePlatform;
  return `Onboardings-${branch._id || "nobranch"}`;
};

// Open DB and ensure store exists
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const storeName = getStoreName();

      if (!db.objectStoreNames.contains(storeName)) {
        const newVersion = db.version + 1;
        db.close();

        const upgradeReq = indexedDB.open(DB_NAME, newVersion);
        upgradeReq.onupgradeneeded = (e) => {
          const upgradeDb = e.target.result;
          if (!upgradeDb.objectStoreNames.contains(storeName)) {
            upgradeDb.createObjectStore(storeName, { keyPath: "_id" });
          }
        };
        upgradeReq.onsuccess = () => resolve(upgradeReq.result);
        upgradeReq.onerror = (e) => reject(e.target.error);
      } else {
        resolve(db);
      }
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const storeName = getStoreName();
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "_id" });
      }
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

// Helper for transactions
async function withStore(mode, callback) {
  const db = await openDB();
  const storeName = getStoreName();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    try {
      const result = callback(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    } catch (err) {
      reject(err);
    }
  });
}

// Save single onboarding
export async function IDB_SAVE(onboarding) {
  return withStore("readwrite", (store) => store.add(onboarding));
}

// Bulk save onboardings
export async function IDB_BULK_SAVE(onboardings) {
  return withStore("readwrite", async (store) => {
    for (const onboarding of onboardings) {
      try {
        const getReq = store.get(onboarding._id);
        const exists = await new Promise((resolve, reject) => {
          getReq.onsuccess = () => resolve(!!getReq.result);
          getReq.onerror = () => reject(getReq.error);
        });
        if (!exists) store.add(onboarding);
      } catch (err) {
        console.error("IDB_BULK_SAVE error:", err);
      }
    }
  });
}

// Update onboarding
export async function IDB_UPDATE(onboarding) {
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      // kunin muna yung lumang data base sa key (dito gamit ko _id, adjust kung iba key mo)
      const getReq = store.get(onboarding._id);

      getReq.onsuccess = () => {
        const oldData = getReq.result || {};
        const newData = { ...oldData, ...onboarding };

        const putReq = store.put(newData);
        putReq.onsuccess = () => resolve(newData);
        putReq.onerror = (e) => reject(e.target.error);
      };

      getReq.onerror = (e) => reject(e.target.error);
    });
  });
}

// Browse all onboardings
export async function IDB_BROWSE() {
  return withStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

// Delete onboarding by id
export async function IDB_DESTROY(id) {
  return withStore("readwrite", (store) => store.delete(id));
}

// Delete entire DB
export function IDB_DESTROY_DB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
