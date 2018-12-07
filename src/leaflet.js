import L from 'leaflet';
import './assets/main.css';
import './plugins/leaflet-mouse-position.js';
import './plugins/Leaflet.PolylineMeasure.js';
import './plugins/Leaflet.PolylineMeasure.css';
import { FeaturesList } from './features/features-list';

let baseMaps;

export function LeafletBaseMap(element, startPos) {

    const mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'aceeu',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    });
    const osm = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let mymap = L.map(element, {
        center: startPos,
        zoom: 7,
        layers: [mapbox]
    });

    baseMaps = {
        "Mapbox": mapbox,
        "OSM": osm
    };
    return mymap;
}

export function Route(map, geometry) {
    L.polyline(geometry, {color: '#ff5555', opacity: 0.5}).addTo(map);
}

export function AddControls(mymap) {

    const overlayMaps = FeaturesList.FeaturesGroupList().reduce((a, g) => {
        a[g.name] = g.group;
        return a;
    }, {});

    FeaturesList.FeaturesGroupList().forEach(e => e.group.addTo(mymap));
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);


    L.control.mousePosition().addTo(mymap);
    L.control.polylineMeasure().addTo(mymap);
}
