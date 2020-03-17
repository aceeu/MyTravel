// Listen for install event, set callback
self.addEventListener('install', function(event) {
    console.log('SW installed:' + event);
});

self.addEventListener('activate', function(event) {
    console.log('SW activated:' + event);
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('aceeu').then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });  