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
