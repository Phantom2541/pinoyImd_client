// indexedDB.js
const DB_NAME = "Onboardings";
const STORE_NAME = "onboardings";
const DB_VERSION = 1;

// Open or create DB
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "_id",
        });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Add single deal
export async function IDB_SAVE(deal) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(deal);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Bulk add deals (array)
export async function IDB_BULK_SAVE(deals) {
  await IDB_DESTROY_DB();
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    deals.forEach((deal) => store.add(deal));

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Update deal (by id)
export async function IDB_UPDATE(deal) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // hanapin muna kung existing na
    const getRequest = store.get(deal._id);

    getRequest.onsuccess = () => {
      const oldData = getRequest.result || {}; // kung wala, empty object lang
      const updatedData = { ...oldData, ...deal };

      const putRequest = store.put(updatedData);

      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Browse all deals
export async function IDB_BROWSE() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const result = request.result || [];
      // sort by createdAt desc (latest first)
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(result);
    };

    request.onerror = () => reject(request.error);
  });
}

// Delete deal by id
export async function IDB_DESTROY(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export function IDB_DESTROY_DB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
