export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const isShop = pathname.startsWith("/shop");
    const isAdmin = pathname.startsWith("/admin-panel");
    const isDownloads = pathname.startsWith("/downloads");

    const isAsset = (() => {
      if (pathname.endsWith("/")) return false;
      return pathname.includes(".") || pathname.includes("/assets/");
    })();

    // For SPA routes (/shop and /admin-panel), fallback to index.html
    if ((isShop || isAdmin) && !isAsset) {
      const indexPath = isShop ? "/shop/index.html" : "/admin-panel/index.html";
      const indexUrl = new URL(indexPath, request.url);
      return fetch(indexUrl, request);
    }

    // Downloads: forward as-is to origin
    if (isDownloads) {
      return fetch(request);
    }

    // Default: proxy to origin
    return fetch(request);
  }
};
