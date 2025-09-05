// tasksIndexedDB.js
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const DB_NAME = `Tasks-${today}`;

// Generate store name dynamically based on user & branch
const getStoreName = () => {
  const activePlatform = JSON.parse(
    localStorage.getItem("activePlatform") || "{}"
  );
  const { branch = {} } = activePlatform;
  return `Tasks-${branch._id || "nobranch"}`;
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

    let result;

    try {
      result = callback(store);
    } catch (err) {
      reject(err);
      return;
    }

    // support async callback
    Promise.resolve(result)
      .then((val) => {
        tx.oncomplete = () => resolve(val);
        tx.onerror = () => reject(tx.error || new Error("Transaction error"));
        tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
      })
      .catch((err) => reject(err));
  });
}

// Save single task
export async function IDB_SAVE(task) {
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      // Check muna kung existing na
      const getReq = store.get(task?._id);
      getReq.onsuccess = () => {
        const existing = getReq.result;
        if (existing) {
          // Update na lang (merge old + new)
          const updated = { ...existing, ...task };
          const putReq = store.put(updated);
          putReq.onsuccess = () => resolve(updated);
          putReq.onerror = () => reject(putReq.error);
        } else {
          // Insert kung wala pa
          const addReq = store.add(task);
          addReq.onsuccess = () => resolve(task);
          addReq.onerror = () => reject(addReq.error);
        }
      };

      getReq.onerror = () => reject(getReq.error);
    });
  });
}

// Bulk save tasks
export async function IDB_BULK_SAVE(tasks) {
  return withStore("readwrite", async (store) => {
    for (const task of tasks) {
      await new Promise((resolve, reject) => {
        const getReq = store.get(task._id);

        getReq.onsuccess = () => {
          const existing = getReq.result;
          if (existing) {
            // merge old + new
            const merged = { ...existing, ...task };
            const putReq = store.put(merged);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          } else {
            const addReq = store.add(task);
            addReq.onsuccess = () => resolve();
            addReq.onerror = () => reject(addReq.error);
          }
        };

        getReq.onerror = () => reject(getReq.error);
      });
    }
    return true;
  });
}

// Update task (merge old data + new data)
export async function IDB_UPDATE(task) {
  console.log("task", task);
  if (!task?._id) return;
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const getReq = store.get(task._id);
      getReq.onsuccess = () => {
        const oldData = getReq.result || {};
        const updated = { ...oldData, ...task };
        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve(updated);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  });
}

// Browse all tasks
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

// Delete task by id
export async function IDB_DESTROY(id) {
  return withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  });
}

// Delete entire DB
export function IDB_DESTROY_DB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
