import L from 'leaflet';
import Data from './assets/test1_raw_json.json';

export function LeafletSampleMap(element) {
    var mymap = L.map(element.id).setView([Data.geometry[0][0], Data.geometry[0][1]], 13);

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //     attribution: 'aceeu',
    //     maxZoom: 18,
    //     id: 'mapbox.streets',
    //     accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    // }).addTo(mymap);
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }).addTo(mymap);
        return mymap;
    }

var geojsonFeature = {
    "type": "Feature",
    "geometry": {
        "type": "LineString",
        "coordinates": Data.geometry.map(v => [v[1], v[0]])
    }
};

export function AddRoute(map) {
    var myLayer = L.geoJSON().addTo(map);
    myLayer.addData(geojsonFeature);
}

export function PointFeature(map) {
    let distance = 0;
    Data.segments[0].steps.forEach(element => {
        const startPoint = Data.geometry[element.way_points[0]];
        const cMarker = L.circleMarker([startPoint[0], startPoint[1]], {color: '#ff9933', radius: 5, fillOpacity: 1});
        const d = distance;
        cMarker.on('click', e => alert(`${d.toFixed(1)} - ${element.instruction}`));
        cMarker.addTo(map);
        distance += element.distance;
    });
}
