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
};

export default indexDB;
