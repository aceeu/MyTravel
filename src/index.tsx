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
// track
import * as Data1day from './assets/1day.json';
import * as Data2day from './assets/2day.json';
import * as Data3day from './assets/3day.json';
import { Route, AddControls } from './leaflet';


const paths: any[] = [Data1day.geometry, Data2day.geometry, Data3day.geometry];

let map: Map = undefined;
// map
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
    paths.forEach(p => Route(map, p));

// RegisterOnList(new MovementMarkersList('mml'));
    RegisterOnList(new ShowPlacesList('Достопримечательности'));
    RegisterOnList(new MilestonesList('Вехи', [].concat(...paths)));
    RegisterOnList(new SimplePointsList('Заправки', [...gas_station], 'fillingstation'));
    RegisterOnList(new SimplePointsList('Ночевки', [...overnight_stay], 'lodging-2'));

    FeaturesList.featuresList.setMap(map);
    FeaturesList.featuresList.init({geometry: Data1day.geometry, segments: Data1day.segments});
    FeaturesList.featuresList.onZoom();
    AddControls(getMap());
}