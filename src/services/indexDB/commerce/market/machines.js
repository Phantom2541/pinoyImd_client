import store from "../../../redux/store";

const DB_NAME = "Services";
const DB_VERSION = 1;

const state = store.getState();
const activePlatform = state.auth.activePlatform;

// 🔧 Initialize Database (with dynamic store)
function openDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      `${DB_NAME}-${JSON.parse(activePlatform)?.branchId}`,
      DB_VERSION
    );

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

  // Check if array
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (!item.id) throw new Error("❌ Missing 'id' in one of the items.");
      store.put(item);
    });
  } else {
    if (!data.id) throw new Error("❌ Missing 'id' in the data.");
    store.put(data);
  }

  return tx.complete; // Wait for everything to finish
}

// 📖 READ ALL
export async function BROWSE(storeName) {
  const db = await openDB(storeName);

  // Check if store exists
  if (!db.objectStoreNames.contains(storeName)) {
    return [];
  }

  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);

  // Wrap getAll in a Promise
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = function (event) {
      resolve(event.target.result); // ✅ actual result (array of records)
    };

    request.onerror = function (event) {
      reject("❌ Failed to fetch data: " + event.target.error);
    };
  });
}

export async function UPDATE(storeName, data) {
  const db = await openDB(storeName);

  // Check if store exists
  if (!db.objectStoreNames.contains(storeName)) {
    return null;
  }

  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.put(data); // put = add or update by key

    request.onsuccess = function () {
      resolve(data); // Return updated item
    };

    request.onerror = function (event) {
      reject("❌ Failed to update item: " + event.target.error);
    };
  });
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
