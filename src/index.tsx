import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap, Map } from './leafletMap';
import { FeaturesList, RegisterFeature, FeatureBase, Feature } from './features/features-list';
// import { MovementMarkersList } from './features/movement-markers';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList } from './features/show-places';
import { SimplePointsList } from './features/simple-points';

import { RouteLine, AddControls } from './leaflet';
import { fetchBinaryData } from './fetch-showplaces';
import { Route } from './features/route';
import { getStep } from './math';

const palette: string[] = [
    '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

let map: Map = undefined;

interface MetaData {
    routeFiles: string[],
    alternates: string[],
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
    // movement markers register
    const results: any[] = await fetchRoutes(routeFiles);
    const geos: any[] = results.map(r => r.geometry);
    geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Main route', r, palette[i % palette.length])))
    RegisterFeature(new MilestonesList('Вехи', 'Main route', [].concat(...geos)));
}

async function AlternateRoutes(alternates: string[]) {
    const results: any[] = await fetchRoutes(alternates);
    results.forEach((r, i) => {
        RegisterFeature(new Route('ar' + i, 'Альтернативные пути', r.geometry, '#0000ff'));
        RegisterFeature(new MilestonesList('Альтернативные пути' + i, 'Альтернативные пути' , r.geometry,
            Math.ceil(getStep(r.summary.distance, 8)), [9, 14]));
    });
}

// async function fetchData(urls: string[]) {
//     const results = urls.map(async url => {
//         const response = await fetch(url);
//         return await response.json();
//     })
//     return Promise.all(results);
// }

async function fetchMetaData(): Promise<MetaData> {
    const response = await fetch('./mongol19/metadata.json');
    return await response.json();
}

async function onMapCreated(map: Map) {
    const metaData: MetaData = await fetchMetaData();
    await MainRoutes(metaData.routeFiles);
    await AlternateRoutes(metaData.alternates);
    const data = await fetchBinaryData(metaData.urls.map(u => './mongol19/' + u));
    let features: FeatureBase[] = [
        new ShowPlacesList('Достопримечательности', 'Достопримечательности', data[0], 'information'),
        new SimplePointsList('Заправки', 'Заправки', data[1], 'fillingstation'),
        new ShowPlacesList('Ночевки', 'Ночевки', data[2], 'lodging-2')
    ];
    features.forEach(f => {
        RegisterFeature(f);

    });

    FeaturesList.featuresList.init(map);

    const overlays = FeaturesList.FeaturesList().reduce((a: any, feature: Feature) => {
        const gname = feature.getGroupName();
        const name: string = gname ? gname : feature.name;
        if (a[name])
            feature.getLayerGroup().addTo(a[name]);
        else
            a[name] = feature.getLayerGroup(); 
        return a;
    }, {});

    overlays['Main route'].addTo(map);
    overlays['Достопримечательности'].addTo(map);


    AddControls(map, overlays);
    // map.on('zoom', () => {
    //     FeaturesList.featuresList.onZoom();
    // })
    // FeaturesList.featuresList.onZoom();
}