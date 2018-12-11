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


// track
// import * as Data1day from './assets/1day.json';
// import * as Data2day from './assets/2day.json';
// import * as Data3day from './assets/3day.json';
// import * as Data4day from './assets/4day.json';
// import * as Data5day from './assets/5day.json';
// import * as Data6day from './assets/6day.json';
// import * as Data7day from './assets/7day.json';

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

function  fetchAndDisplayRoute(map: Map) {
    routeFiles.forEach((rjs, i) => {
        fetch('/mongol19/' + rjs).then(response =>
            response.json().then(
                json => {
                    console.log(json);
                    Route(map, json.geometry, palette[i % palette.length])
                }
            )
        );
    });
}

function onMapCreated(map: Map) {
// movement markers register
    fetchAndDisplayRoute(map);
// RegisterOnList(new MovementMarkersList('mml'));
    RegisterOnList(new ShowPlacesList('Достопримечательности', [...show_places]));
    // RegisterOnList(new MilestonesList('Вехи', [].concat(...paths)));
    RegisterOnList(new SimplePointsList('Заправки', [...gas_station], 'fillingstation'));
    RegisterOnList(new ShowPlacesList('Ночевки', [...overnight_stay], 'lodging-2'));

    FeaturesList.featuresList.setMap(map);
    FeaturesList.featuresList.init();
    FeaturesList.featuresList.onZoom();
    AddControls(getMap());
}