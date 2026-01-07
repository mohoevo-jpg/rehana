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

    // Helper to add CSP headers
    const addCSP = (response) => {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://cloudflareinsights.com; " +
        "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://cloudflareinsights.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https: ws: wss: https://static.cloudflareinsights.com https://cloudflareinsights.com; " +
        "frame-src 'self'; " +
        "object-src 'none'; " +
        "upgrade-insecure-requests"
      );
      return newResponse;
    };

    // Downloads: forward as-is to origin
    if (isDownloads) {
      return fetch(request);
    }

    // Default: proxy to origin
    const response = await fetch(request);
    return addCSP(response);
  }
};
