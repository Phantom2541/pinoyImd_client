// indexedDB.js
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const DB_NAME = `Deals-${today}`;

// Generate store name based on user & branch
const getStoreName = () => {
  const activePlatform = JSON.parse(
    localStorage.getItem("activePlatform") || "{}"
  );
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const { branch = {} } = activePlatform;
  return `Deals-${auth._id || "noauth"}-${branch._id || "nobranch"}`;
};

// Open DB and ensure store exists
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const storeName = getStoreName();

      if (!db.objectStoreNames.contains(storeName)) {
        // Close and upgrade DB to add store
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

// Helper to run a callback with store in a transaction
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

// Save single deal
export async function IDB_SAVE(deal) {
  return withStore("readwrite", (store) => store.add(deal));
}

// Bulk save deals
export async function IDB_BULK_SAVE(deals) {
  return withStore("readwrite", async (store) => {
    for (const deal of deals) {
      try {
        // subukan i-get muna kung existing
        const getReq = store.get(deal._id);
        const exists = await new Promise((resolve, reject) => {
          getReq.onsuccess = () => resolve(!!getReq.result);
          getReq.onerror = () => reject(getReq.error);
        });

        if (!exists) {
          store.add(deal); // add only kung wala pa
        }
        // kung exists, skip lang
      } catch (err) {
        console.error("IDB_BULK_SAVE error:", err);
      }
    }
  });
}

// Update deal
export async function IDB_UPDATE(deal) {
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const getReq = store.get(deal._id);

      getReq.onsuccess = () => {
        const oldData = getReq.result || {};

        // pagsamahin yung dati at bago
        const merged = { ...oldData, ...deal };

        // isave gamit put
        const putReq = store.put(merged);

        putReq.onsuccess = () => resolve(merged);
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  });
}
// Browse all deals
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

// Delete deal by id
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
