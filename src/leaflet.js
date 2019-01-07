import L from 'leaflet';
import './assets/main.css';
import './plugins/leaflet-mouse-position.js';
import './plugins/Leaflet.PolylineMeasure.js';
import './plugins/Leaflet.PolylineMeasure.css';
import { FeaturesList } from './features/features-list';

let baseMaps;

export function LeafletBaseMap(element, startPos) {

    const mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'mapbox; openstreetmap',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    });
    const osm = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const outDoors = L.tileLayer('https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=99ae1bf83076479f99b0a1878abdf254', {
	    attribution: 'thunderforest outdoors'
    });

    let mymap = L.map(element, {
        center: startPos,
        zoom: 7,
        layers: [mapbox]
    });

    baseMaps = {
        "Mapbox": mapbox,
        "OSM": osm,
        "Satelite": Esri_WorldImagery,
        "Outdoors": outDoors
    };
    return mymap;
}



export function RouteLine(geometry, color) {
    return L.polyline(geometry, {weight: 3, color: color || '#ff5555', opacity: 0.9});
}

export function AddControls(mymap, overlays) {

    L.control.layers(baseMaps, overlays).addTo(mymap);

    L.control.mousePosition().addTo(mymap);
    L.control.polylineMeasure().addTo(mymap);
}
