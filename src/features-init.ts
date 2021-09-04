import { Map } from './leafletMap';
import { FeaturesList, RegisterFeature, LayerGroupFeature, Feature } from './features/features-list';
import { config } from './config';
import { _, LatLng} from './leaflet-define';
import { makeFeatureFromMetaData, MetaData2 } from './feature-factory';
import {reg as regPoi} from './features-poi'
import {reg as regRoute} from './features-routes'

import { getBaseLayers } from './leaflet';

regPoi();
regRoute();

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

function AddControls(mymap: Map, overlays: any) {

    const f = getBaseLayers()
    _().control.layers(f, overlays).addTo(mymap);
    _().control.mousePosition().addTo(mymap);
    _().control.polylineMeasure().addTo(mymap);
}

async function fetchMetaData2(): Promise<MetaData2> {
    const response = await fetch(`${config.mapPath}/metadata2.json`);
    return response.json();
}

export default async function features(map: Map) {
    const metaData2: MetaData2 = await fetchMetaData2();
    map.setView(LatLng(...metaData2.center), 8);

    const features = makeFeatureFromMetaData(metaData2, map);

    features.forEach(p => p.then(f => f.forEach(fi => RegisterFeature(fi))));
    await Promise.all(features).then(() => FeaturesList.featuresList.init(map));

    
    const overlays: {[key:string]: any} = FeaturesList.FeaturesList().reduce((a: {[key:string]: any}, feature: Feature) => {
        const gname = feature.getGroupName();
        const name: string = gname ? gname : feature.name;
        if (a[name])
            feature.getLayerGroup().addTo(a[name]);
        else
            a[name] = feature.getLayerGroup(); 
        return a;
    }, {});

    Object.keys(overlays).forEach(key => {
        const mdRow = metaData2.data.find(r => key == r.groupName)
        if (mdRow?.showByDefault)
            overlays[key].addTo(map)
    });

    AddControls(map, overlays);

}

