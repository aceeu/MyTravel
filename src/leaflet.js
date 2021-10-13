import * as L from 'leaflet';
import './assets/main.css';
import './plugins/leaflet-mouse-position.js';
import './plugins/Leaflet.PolylineMeasure.js';
import './plugins/Leaflet.PolylineMeasure.css';
import './plugins/Polyline.encoded.js';

// набор тайл серверов
// https://wiki.openstreetmap.org/wiki/Tile_servers

const layers = {
    "Mapbox": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'mapbox; openstreetmap',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    }),
    "Mapbox satellite": L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
        attribution: 'mapbox; openstreetmap',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiYWNlZXUiLCJhIjoiY2pvZzR6OXg3MDJuMDN3bnhmb24zcGt5biJ9.zpuG05zrtlhpz7LVLVmxcg'
    }),
    "OSM":  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }),
    // "Satelite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	//     attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    // }),
    "Outdoors": L.tileLayer('https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=99ae1bf83076479f99b0a1878abdf254', {
	    attribution: 'thunderforest outdoors'
    }),
    "Outdoors landscape": L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=99ae1bf83076479f99b0a1878abdf254', {
	    attribution: 'thunderforest outdoors'
    })
}

export function getBaseLayers()  {return layers;}

export function getStravaHeatMap() {
    return L.tileLayer('https://heatmap-external-a.strava.com/tiles-auth/all/red/{z}/{x}/{y}.png?Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTYzNTAxNjQ0M30sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjMzNzkyNDQzfX19XX0_&Signature=dTRmr9kFV5yhKov~3VnqJNvQ420HU3IuBXhDaJwY2xrEcRmzfbTvOppO-Mk8qaA51UIUX1GWWtR6ca0mZqEimI-q3lMfRoWRTbL6EhN5yU5gtI6rOsHWtkDJvFoBngdN9f9or2ogyl4HGbzEuvenFHZIVqj1Cqo8ae-uiyYZhRWvBA~LLBu1UlcxBSXM4Kwxqr0AS4grtO7GoZAWeazpkPQcS3hHcXBtRImKlOzqRZiCV-Nd4eovOLkduCrF5Gykvx-eolwF6Pk7WyWllqfHzpTkzQe9OpI2nMV2Qq~QJa1NsbNBtsrolHvZN94KaR3ogciwdzFw0xEd4I~rMA5ZAw__', { maxZoom: 18})
}
