import { useEffect } from "react";

const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyAppDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("storage")) {
        db.createObjectStore("storage", { keyPath: "key" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const useIndexedDB = () => {
  const setItem = async (key, value) => {
    const db = await openDB();
    const transaction = db.transaction("storage", "readwrite");
    const store = transaction.objectStore("storage");
    store.put({ key, value });
  };

  const getItem = async (key) => {
    const db = await openDB();
    const transaction = db.transaction("storage", "readonly");
    const store = transaction.objectStore("storage");
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  };

  return { setItem, getItem };
};
