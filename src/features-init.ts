import { Map } from './leafletMap';
import { FeaturesList, RegisterFeature, FeatureBase, Feature } from './features/features-list';
import { MilestonesList } from './features/mile-stones';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { AddControls } from './leaflet';
import { fetchBinaryData, fetchBinaryRouteData } from './fetch-showplaces';
import { Route } from './features/route';
import { getStep } from './math';
import { ShowPlaceboardProps } from 'controls/show-place-board';
import { config } from './config';

const palette: string[] = [
    '#990000', '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

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

export default async function features(map: Map) {
    const metaData: MetaData = await fetchMetaData();
    const featuresX = await Promise.all([
        MainRoutes(metaData.routeFiles.map(f => f.filename)),
        ARoute(metaData.alternates.map(f => f.filename), 'Дополнительные маршруты', '#0000ff'),
        POI(metaData, map)
    ]);
    
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
    
    overlays['Достопримечательности'].addTo(map);
    // metaData.urls.map(u => u.name).filter(onlyUnique).forEach(e => overlays[e].addTo(map));


    AddControls(map, overlays);
    map.on('zoom', () => {
        FeaturesList.featuresList.onZoom();
    })
    FeaturesList.featuresList.onZoom();
}

async function MainRoutes(routeFiles: string[]) {
    const results: any[] = await fetchBinaryRouteData(routeFiles.map(u => config.mapPathBin + '/' + u));
    const geos: any[] = results.map(r => r.geometry);
    const color = (i: number) => palette[i % palette.length];
    geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Основной маршрут', r, color(i))))
    RegisterFeature(new MilestonesList('Вехи', 'Основной маршрут', [].concat(...geos), undefined, undefined, 'black'));
}

async function ARoute(routes: string[], name: string, color: string) {
    const results: any[] = await fetchBinaryRouteData(routes.map(u => config.mapPathBin + '/' + u));
    return results.forEach((r, i) => {
        RegisterFeature(new Route(name + i, name, r.geometry, color));
        RegisterFeature(new MilestonesList(name + i, name , r.geometry,
            Math.ceil(getStep(r.properties.summary.distance, 8)), [9, 14], color));
    });
}

async function fetchMetaData(): Promise<MetaData> {
    const response = await fetch(`${config.mapPath}/metadata.json`);
    return await response.json();
}

async function POI(metaData: MetaData, map: Map) {
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
