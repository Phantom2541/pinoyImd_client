const indexDB = {
  cleanOldStores: async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const databases = await indexedDB.databases();

    for (const dbInfo of databases) {
      const dbName = dbInfo.name;
      if (!dbName) continue;

      const match = dbName.match(/\d{4}-\d{2}-\d{2}$/);
      if (match) {
        const dbDate = match[0];
        if (dbDate !== today) {
          indexedDB.deleteDatabase(dbName);
        }
      }
    }
  },
  clearAll: async () => {
    const databases = await indexedDB.databases();

    const deletePromises = databases.map((dbInfo) => {
      const dbName = dbInfo.name;
      if (!dbName) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        request.onblocked = () => console.warn(`Delete blocked for ${dbName}`);
      });
    });

    await Promise.all(deletePromises);
  },
};

export default indexDB;
