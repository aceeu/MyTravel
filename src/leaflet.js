import L from 'leaflet';
import './assets/main.css';

export function LeafletBaseMap(element, startPos) {
    var mymap = L.map(element).setView(startPos, 9);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'aceeu',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    }).addTo(mymap);
    // L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 16,
    //     attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    // }).addTo(mymap);

    return mymap;
}

function GeoJson(geometry) {
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": geometry.map(v => [v[1], v[0]])
        }
    };
}

export function Route(map, geometry) {
    var myLayer = L.geoJSON().addTo(map);
    myLayer.addData(GeoJson(geometry));
}
