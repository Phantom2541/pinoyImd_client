const clearSiteData = (string) => {
  // ✅ Clear localStorage
  localStorage.clear();

  // ✅ Clear sessionStorage
  sessionStorage.clear();

  // ✅ Clear all accessible cookies (non-HttpOnly)
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "") // trim leading space
      .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });

  // ✅ Clear Cache Storage (used in PWAs or if you're caching fetch requests)
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }

  console.log("✅ Site data cleared.");
};

export default clearSiteData;
