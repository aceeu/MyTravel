import L from 'leaflet';

export function LeafletSampleMap(element, latLong) {
    console.log(element.id);
    var mymap = L.map(element.id).setView(latLong, 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'aceeu',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    }).addTo(mymap);    
}
