// Wipes everything this site keeps in the browser so the next person on this
// device starts clean: local and session storage, cookies, Cache Storage and
// IndexedDB (cached records can be personal health information).
//
// Returns a promise. Await it before navigating or reloading -- the cache and
// database deletions are asynchronous and a reload can cut them short.
const deleteDatabases = async () => {
  if (!("indexedDB" in window)) return;

  // `databases()` isn't available everywhere (older Firefox); "Services" is
  // the one database the app creates itself (services/indexDB).
  const names = new Set(["Services"]);

  try {
    (await window.indexedDB.databases?.())?.forEach(({ name }) => {
      if (name) names.add(name);
    });
  } catch (error) {
    // Fall back to the known name.
  }

  await Promise.all(
    [...names].map(
      (name) =>
        new Promise((resolve) => {
          const request = window.indexedDB.deleteDatabase(name);
          request.onsuccess =
            request.onerror =
            request.onblocked =
              () => resolve();
        }),
    ),
  );
};

// `keep`: localStorage keys to carry over -- only things that are not about the
// person (which clinic's page this is, that clinic's public details).
const clearSiteData = async ({ keep = [] } = {}) => {
  try {
    const kept = keep
      .map((key) => [key, localStorage.getItem(key)])
      .filter(([, value]) => value !== null);

    localStorage.clear();
    sessionStorage.clear();
    // Restored right away (this part runs before the first await below).
    kept.forEach(([key, value]) => localStorage.setItem(key, value));
  } catch (error) {
    // Storage can be blocked (private mode, policies); keep clearing the rest.
  }

  // Cookies we can reach (non-HttpOnly)
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });

  // Cache Storage (PWA / cached fetches)
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    } catch (error) {
      // Not available in this context.
    }
  }

  await deleteDatabases();
};

export default clearSiteData;
