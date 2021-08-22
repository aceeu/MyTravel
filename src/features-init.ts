import { Map } from './leafletMap';
import { FeaturesList, RegisterFeature, FeatureBase, Feature } from './features/features-list';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { AddControls } from './leaflet';
import { fetchBinaryData } from './fetch-showplaces';
import { ShowPlaceboardProps } from './controls/show-place-board';
import { config } from './config';
import { MainRoutes, ARoute } from './features-routes';



interface PoiUrls {
    filename: string;
    name: string;
    group: string;
}

interface routeFile {
    filename: string;
}

export interface MetaData {
    routeFiles: routeFile[], // основные маршруты
    alternates: routeFile[], // альтернитивные маршруты
    urls: PoiUrls[] // тут слои достопримечательностей
}

export default async function features(map: Map) {
    const metaData: MetaData = await fetchMetaData();
    await Promise.all([
        MainRoutes(metaData),
        ARoute(metaData),
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
    await Promise.all(features).then(() => FeaturesList.featuresList.init(map));
}
