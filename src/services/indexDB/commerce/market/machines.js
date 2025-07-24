const DB_NAME = "Machines";
const DB_VERSION = 1;

// 🔧 Initialize Database (with dynamic store)
function openDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("❌ Error sa pagbukas ng DB: " + event.target.error);
    };
  });
}

// ✅ CREATE / UPDATE
export async function SAVE(storeName, data) {
  const db = await openDB(storeName);
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  return store.put(data);
}

// 📖 READ ALL
export async function BROWSE(storeName) {
  const db = await openDB(storeName);
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return store.getAll();
}

// 📝 READ ONE
export async function getDataById(storeName, id) {
  const db = await openDB(storeName);
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return store.get(id);
}

// 🗑️ DELETE ONE
export async function DESTROY(storeName, id) {
  const db = await openDB(storeName);
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  return store.delete(id);
}

// ❌ CLEAR ALL
export async function CLEAR(storeName) {
  const db = await openDB(storeName);
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  return store.clear();
}
