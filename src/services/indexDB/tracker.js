// tasksIndexedDB.js
const DB_NAME = "TrackerDB"; // fixed DB name

// Store name fixed
const getStoreName = () => `Tracker`;

// Open DB and ensure store exists
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const storeName = getStoreName();
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "branch" }); // keyPath gamit ang _id
      }
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

// Transaction helper
async function withStore(mode, callback) {
  const db = await openDB();
  const storeName = getStoreName();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    try {
      const result = callback(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error("Transaction error"));
      tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
    } catch (err) {
      reject(err);
    }
  });
}

/* ================================
   SAVE / UPDATE / BROWSE ONLY
================================ */

// Save or update a single object
export async function IDB_SAVE(task) {
  if (!task?.branch) return;
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      // check if object exists
      const getReq = store.get(task?.branch);
      getReq.onsuccess = () => {
        const existing = getReq.result;
        const updated = existing ? { ...existing, ...task } : task;
        const putReq = store.put(updated); // add if new, update if exists
        putReq.onsuccess = () => resolve(updated);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  });
}

// Browse object by activePlatform.branchId
export async function IDB_BROWSE() {
  return withStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const activePlatform = JSON.parse(
        localStorage.getItem("activePlatform") || "{}"
      );
      const branchId = activePlatform.branchId || null;
      if (!branchId) return resolve(null);

      const request = store.get(branchId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
}
