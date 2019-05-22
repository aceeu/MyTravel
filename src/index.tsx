import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap, Map } from './leafletMap';
import { FeaturesList, RegisterFeature, FeatureBase, Feature } from './features/features-list';
// import { MovementMarkersList } from './features/movement-markers';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { SimplePointsList } from './features/simple-points';

import { AddControls } from './leaflet';
import { fetchBinaryData, fetchBinaryRouteData } from './fetch-showplaces';
import { Route } from './features/route';
import { getStep } from './math';
import { AddButtonsToTheMap } from './controls';
import { ShowPlaceboardProps } from 'controls/show-place-board';
import { getTrackersLayer } from './tracker/trackersGroupLayer';

const palette: string[] = [
    '#990000'
    // '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

let map: Map = undefined;

interface MetaData {
    routeFiles: string[],
    alternates: string[],
    tyva: string[],
    urls: string[]
}

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

function fetchRoutes(files: string[]) {
    let res: {[key: number]: any} = {};
    let promices = files.map(async (route, i) => {
        const response = await fetch('./mongol19/' + route);
        return response.json();
    });
    return Promise.all(promices);
}

async function MainRoutes(routeFiles: string[]) {
    const results: any[] = await fetchBinaryRouteData(routeFiles.map(u => './mongol19/bin/' + u));
    const geos: any[] = results.map(r => r.geometry);
    geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Основной маршрут', r, palette[i % palette.length])))
    RegisterFeature(new MilestonesList('Вехи', 'Основной маршрут', [].concat(...geos)));
}

// async function AlternateRoutes(alternates: string[]) {
//     const results: any[] = await fetchBinaryRouteData(alternates.map(u => './mongol19/bin/' + u));
//     results.forEach((r, i) => {
//         RegisterFeature(new Route('ar' + i, 'Дополнительные маршруты', r.geometry, '#0000ff'));
//         RegisterFeature(new MilestonesList('Дополнительные маршруты' + i, 'Дополнительные маршруты' , r.geometry,
//             Math.ceil(getStep(r.summary.distance, 8)), [9, 14]));
//     });
// }

async function ARoute(routes: string[], name: string, color: string) {
    const results: any[] = await fetchBinaryRouteData(routes.map(u => './mongol19/bin/' + u));
    results.forEach((r, i) => {
        RegisterFeature(new Route(name + i, name, r.geometry, color));
        RegisterFeature(new MilestonesList(name + i, name , r.geometry,
            Math.ceil(getStep(r.summary.distance, 8)), [9, 14]));
    });
}

async function fetchMetaData(): Promise<MetaData> {
    const response = await fetch('./mongol19/metadata.json');
    return await response.json();
}

async function onMapCreated(map: Map) {
    const metaData: MetaData = await fetchMetaData();
    await MainRoutes(metaData.routeFiles);
    await ARoute(metaData.alternates, 'Дополнительные маршруты', '#0000ff');
    await ARoute(metaData.tyva, 'Тыва', '#1f7a1f');
    const data = await fetchBinaryData(metaData.urls.map(u => './mongol19/bin/' + u));
    const seeSights: ShowPlaceboardProps[] = data[0];
    const mainPoints: ShowPlaceboardProps[] = seeSights.filter((ss: ShowPlaceboardProps) => ss.gravity >= 4);
    let features: FeatureBase[] = [
        new ShowPlacesList('Основные Достопримечательности', 'Основные Достопримечательности', mainPoints as ShowPlacesListData[], 'information'),
        new ShowPlacesList('Достопримечательности', 'Достопримечательности', data[0].filter((v: any) => v.gravity < 4), 'information'),
        new SimplePointsList('Заправки', 'Заправки', data[1], 'fillingstation'),
        new ShowPlacesList('Ночевки', 'Ночевки', data[2], 'lodging-2')
    ];
    features.forEach(f => {
        RegisterFeature(f);

    });

    FeaturesList.featuresList.init(map);

    const overlays: {[key:string]: any} = FeaturesList.FeaturesList().reduce((a: {[key:string]: any}, feature: Feature) => {
        const gname = feature.getGroupName();
        const name: string = gname ? gname : feature.name;
        if (a[name])
            feature.getLayerGroup().addTo(a[name]);
        else
            a[name] = feature.getLayerGroup(); 
        return a;
    }, {});

    // aceeu
    overlays['Маячки'] = getTrackersLayer();

    overlays['Основной маршрут'].addTo(map);
    overlays['Основные Достопримечательности'].addTo(map);
    overlays['Достопримечательности'].addTo(map);


    AddControls(map, overlays);
    // map.on('zoom', () => {
    //     FeaturesList.featuresList.onZoom();
    // })
    // FeaturesList.featuresList.onZoom();
    AddButtonsToTheMap(map);
}