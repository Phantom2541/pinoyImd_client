const DB_NAME = "Services";

async function openDB(storeName, allowCreateIfMissing = false) {
  // Step 1: Get current version
  const currentVersion = await new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = (e) => {
      const db = e.target.result;
      resolve(db.version);
      db.close();
    };
    request.onerror = () => resolve(1); // fallback if DB doesn't exist
  });

  // Step 2: Check if store exists
  const storeExists = await new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const exists = db.objectStoreNames.contains(storeName);
      db.close();
      resolve(exists);
    };
    request.onerror = () => resolve(false);
  });

  // 🟡 If store doesn't exist
  if (!storeExists) {
    if (!allowCreateIfMissing) {
      // Return null to indicate store not found and not created
      return null;
    }

    // Else upgrade to create new store
    const upgradedVersion = currentVersion + 1;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, upgradedVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: "id" });
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) =>
        reject("❌ Failed to open DB: " + event.target.error);
    });
  }

  // ✅ Open normally
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, currentVersion);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject("❌ Failed to open DB: " + e.target.error);
  });
}

// ✅ CREATE / UPDATE
export async function SAVE(storeName, data) {
  const db = await openDB(storeName, true);
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
  console.log("db", db);
  if (!db) return [];
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
