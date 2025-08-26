// menusIndexedDB.js
const DB_NAME = "Global-Physicians";

// Generate store name based on user & branch
const getStoreName = () => {
  return `global-physicians`;
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

export async function IDB_BULK_SAVE(menus) {
  if (menus.length === 0) return;
  return withStore("readwrite", async (store) => {
    for (const menu of menus) {
      await new Promise((resolve, reject) => {
        const getReq = store.get(menu._id);

        getReq.onsuccess = () => {
          const existing = getReq.result;

          if (existing && menu.deletedAt) {
            const delReq = store.delete(menu._id);
            delReq.onsuccess = () => resolve();
            delReq.onerror = () => reject(delReq.error);
            return;
          }

          if (!existing && menu.deletedAt) {
            resolve();
            return;
          }

          const updated = existing ? { ...existing, ...menu } : menu;
          const putReq = store.put(updated);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        };

        getReq.onerror = () => reject(getReq.error);
      });
    }
    return true;
  });
}

export async function IDB_BROWSE() {
  return withStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  });
}
