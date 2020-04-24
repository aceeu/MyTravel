importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
  console.log('workbox is on');
  
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    /\/\/api\.tiles\.mapbox\.com\/v4\/mapbox\.streets\S*\.(png|jpg)/,
    new workbox.strategies.CacheFirst(
      {
        cacheName: 'mapbox-tiles-cache',
      }
    )
  )
} else {
  console.log('workbox failed');
}

// Listen for install event, set callback
// self.addEventListener('install', function(event) {
//     console.log('SW installed:' + event);
// });

// self.addEventListener('activate', function(event) {
//     console.log('SW activated:' + event);
// });

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.open('aceeu').then(function(cache) {
//         return cache.match(event.request).then(function (response) {
//             if (response) {
//                 console.log('cache:' + event.request.url);
//                 return response;
//             }
//             console.log('fetch:' + event.request.url);
//             return fetch(event.request).then(function(response) {
//             cache.put(event.request, response.clone());
//             return response;
//           });
//         });
//       })
//     );
//   }); 