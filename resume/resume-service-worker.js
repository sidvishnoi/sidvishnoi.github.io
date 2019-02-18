const version = '506c824';
const VERSIONS = {
  offline: 'offline#' + version,
  tmp: 'tmp#' + version,
};
const OFFLINE_ASSETS = [
  '/resume/',
  '/resume/index.html',
  '/assets/css/resume.css',
  '/assets/icons/pdf.svg',
  '/assets/icons/github.svg',
  '/assets/icons/linkedin.svg',
  '/assets/icons/stackoverflow.svg',
  'sudhanshu-vishnoi-resume.pdf',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(VERSIONS.offline)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  if (new URL(event.request.url).hostname !== location.hostname) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(cached => {
        // return cached responses immediately and meanwhile pull
        // a network response and store that in the cache.
        const networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);
        return cached || networked;
      })
  );

  function fetchedFromNetwork(response) {
    const cacheCopy = response.clone();
    caches
      .open(VERSIONS.tmp)
      .then(cache => cache.put(event.request, cacheCopy));
    return response;
  }

  function unableToResolve () {
    // fetch request failed in both cache and network
    return new Response('<h1><pre>Service Unavailable</pre></h1>', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/html' }),
    });
  }
});

self.addEventListener('activate', event => {
  const deleteOldCaches = new Promise(resolve => {
    return caches.keys().then(keys => {
      const deleteCaches = keys
        .filter(key => key !== VERSIONS.offline)
        .map(key => caches.delete(key));
      return Promise.all(deleteCaches).then(resolve);
    });
  });
  event.waitUntil(deleteOldCaches);
});
