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
import * as Data1day from './assets/1day.json';
import * as Data2day from './assets/2day.json';
import * as Data3day from './assets/3day.json';
import { Route, AddControls } from './leaflet';


const paths: any[] = [Data1day.geometry, Data2day.geometry, Data3day.geometry];

const palette: string[] = [
    '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

let map: Map = undefined;


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

function onMapCreated(map: Map) {
// movement markers register
    paths.forEach((p, i) => Route(map, p, palette[i % palette.length]));

// RegisterOnList(new MovementMarkersList('mml'));
    RegisterOnList(new ShowPlacesList('Достопримечательности', [...show_places]));
    RegisterOnList(new MilestonesList('Вехи', [].concat(...paths)));
    RegisterOnList(new SimplePointsList('Заправки', [...gas_station], 'fillingstation'));
    RegisterOnList(new ShowPlacesList('Ночевки', [...overnight_stay], 'lodging-2'));

    FeaturesList.featuresList.setMap(map);
    FeaturesList.featuresList.init({geometry: Data1day.geometry, segments: Data1day.segments});
    FeaturesList.featuresList.onZoom();
    AddControls(getMap());
}