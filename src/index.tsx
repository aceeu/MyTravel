import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap, Map } from './leafletMap';
import { FeaturesList, RegisterFeature, FeatureBase, Feature } from './features/features-list';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';

import { AddControls } from './leaflet';
import { fetchBinaryData, fetchBinaryRouteData } from './fetch-showplaces';
import { Route } from './features/route';
import { getStep } from './math';
import { AddButtonsToTheMap } from './controls';
import { ShowPlaceboardProps } from 'controls/show-place-board';
import { config } from './config';
import _ from './leaflet-define';
import { PWAPromo } from './controls/pwa-promotion';

const palette: string[] = [
    '#990000', '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

let map: Map = undefined;

interface PoiUrls {
    filename: string;
    name: string;
    group: string;
}

interface routeFile {
    filename: string;
}

interface MetaData {
    routeFiles: routeFile[], // основные маршруты
    alternates: routeFile[], // альтернитивные маршруты
    urls: PoiUrls[] // тут слои достопримечательностей
}

ReactDOM.render(
    <LeafletMap 
        onMap={m => {
            map = m;
            onMapCreated(map);
            initServiceWorker();
            installPWA();
        }}
    />, document.getElementById('map'));

export function getMap() {
    return map;
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(location.href + 'service-worker.js')
            .then(reg => console.log('registration successful, scope is:'+ reg.scope))
            .catch(err => console.log('service worker registration failed: ' + err))
    }
}

function installPWA() {
    if (document.location.protocol == 'http:' && document.location.hostname != 'localhost') {
        document.location.assign('https://' + document.location.hostname + ':8079' + document.location.pathname);
        return;
    }
    // https://web.dev/customize-install/#criteria
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        let header = document.getElementById('header');
        if (header) {
            ReactDOM.render(
                <PWAPromo
                    on={(res: boolean) => {
                        header!.style.display='none';
                        if (res) {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice.then((choiceResult: any) => {
                                if (choiceResult.outcome === 'accepted') {
                                  console.log('User accepted the install prompt');
                                } else {
                                  console.log('User dismissed the install prompt');
                                }
                            })
                        }
                    }}
                />, header
            );
        }
    });
}

async function MainRoutes(routeFiles: string[]) {
    const results: any[] = await fetchBinaryRouteData(routeFiles.map(u => config.mapPathBin + '/' + u));
    const geos: any[] = results.map(r => r.geometry);
    geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Основной маршрут', r, palette[i % palette.length])))
    RegisterFeature(new MilestonesList('Вехи', 'Основной маршрут', [].concat(...geos)));
}

async function ARoute(routes: string[], name: string, color: string) {
    const results: any[] = await fetchBinaryRouteData(routes.map(u => config.mapPathBin + u));
    return results.forEach((r, i) => {
        RegisterFeature(new Route(name + i, name, r.geometry, color));
        RegisterFeature(new MilestonesList(name + i, name , r.geometry,
            Math.ceil(getStep(r.summary.distance, 8)), [9, 14]));
    });
}

async function fetchMetaData(): Promise<MetaData> {
    const response = await fetch(`${config.mapPath}/metadata.json`);
    return await response.json();
}

async function POI(metaData: MetaData) {
    let features: Promise<FeatureBase>[] = metaData.urls.map(async(u: PoiUrls) => {
       const filePath = config.mapPathBin + '/' + u.filename;
       const [data] = await fetchBinaryData([filePath]);

       const dataProps: ShowPlaceboardProps[] = data;
    //    const uralovedFiltered: ShowPlaceboardProps[] = uraloved.filter((ss: ShowPlaceboardProps) => ss.gravity >= 0);
    //    const nashural: ShowPlaceboardProps[] = data[0];
        return new ShowPlacesList(u.name, u.group, dataProps as ShowPlacesListData[], 'information') as FeatureBase;
           // new ShowPlacesList('Ураловед', 'Ураловед', uralovedFiltered as ShowPlacesListData[], 'information'),
           // new SimplePointsList('Заправки', 'Заправки', data[1], 'fillingstation'),
           // new ShowPlacesList('Ночевки', 'Ночевки', data[2], 'lodging-2')
    });
    features.forEach(f => f.then(v => RegisterFeature(v)));
    return Promise.all(features).then(() => FeaturesList.featuresList.init(map));
}

async function onMapCreated(map: Map) {
    const metaData: MetaData = await fetchMetaData();
    await MainRoutes(metaData.routeFiles.map(f => f.filename));
    // await ARoute(metaData.alternates, 'Дополнительные маршруты', '#0000ff');
    // await ARoute(metaData.tyva, 'Тыва', '#1f7a1f');
    await POI(metaData);

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
    // overlays['Маячки'] = getTrackersLayer();

    overlays['Основной маршрут'].addTo(map);
    // overlays['Ураловед'].addTo(map);
    overlays['Достопримечательности на маршруте'].addTo(map);


    AddControls(map, overlays);
    map.on('zoom', () => {
        FeaturesList.featuresList.onZoom();
    })
    FeaturesList.featuresList.onZoom();
    AddButtonsToTheMap(map);
}