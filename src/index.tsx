import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap, Map } from './leafletMap';
import { FeaturesList, RegisterOnList } from './features/features-list';
// import { MovementMarkersList } from './features/movement-markers';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList } from './features/show-places';
import { SimplePointsList } from './features/simple-points';
import * as gas_station from './assets/gas-station.json';
import * as overnight_stay from './assets/overnight-stay.json';
import * as show_places from './assets/show-places-data.json';

import { Route, AddControls } from './leaflet';


// const paths: any[] = [Data1day.geometry, Data2day.geometry,
//     Data3day.geometry, Data4day.geometry, Data5day.geometry,
//     Data6day.geometry, Data7day.geometry];

const palette: string[] = [
    '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

let map: Map = undefined;

const routeFiles = ['1day.json', '2day.json', '3day.json',
    '4day.json', '5day.json', '6day.json', '7day.json'];

ReactDOM.render(
    <LeafletMap 
        onMap={m => {
            map = m;
            onMapCreated(map);
        }}
    />, document.getElementById('map'));

export function getMap() {
    return map;
}

type path = number[][];

function fetchRoutes() {
    let res: {[key: number]: any} = {};
    let promices = routeFiles.map(async (route, i) => {
        const response = await fetch('/mongol19/' + route);
        return response.json();
    });
    return Promise.all(promices);
}

async function onMapCreated(map: Map) {
// movement markers register
    const results: any[] = await fetchRoutes();
    const geos: any[] = results.map(r => r.geometry);
    geos.forEach((r, i) => Route(map, r, palette[i % palette.length]));
    RegisterOnList(new MilestonesList('Вехи', [].concat(...geos)));
    const show_places_: any = show_places;
// RegisterOnList(new MovementMarkersList('mml'));
    RegisterOnList(new ShowPlacesList('Достопримечательности', [...show_places_.default]));
    const gas_station_: any = gas_station;
    RegisterOnList(new SimplePointsList('Заправки', [...gas_station_.default], 'fillingstation'));
    const overnight_stay_: any = overnight_stay;
    RegisterOnList(new ShowPlacesList('Ночевки', [...overnight_stay_.default], 'lodging-2'));

    FeaturesList.featuresList.setMap(map);
    FeaturesList.featuresList.init();
    // FeaturesList.featuresList.onZoom();
    AddControls(map);
}