import { config } from "./config";
import { PoiBallonProps } from "./controls/poi-ballon-control";
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";
import { Feature } from "./features/features-list";
import { PoiList, PoiListData } from "./features/show-places";
import { fetchBinaryData } from "./bin-loader";

// async function POI(metaData: MetaData, map: Map) {
//     let features: Promise<FeatureBase>[] = metaData.urls.map(async(u: PoiUrls) => {
//        const filePath = config.mapPathBin + '/' + u.filename;
//        const [data] = await fetchBinaryData([filePath]);

//        const dataProps: ShowPlaceboardProps[] = data;
//     //    const uralovedFiltered: ShowPlaceboardProps[] = uraloved.filter((ss: ShowPlaceboardProps) => ss.gravity >= 0);
//     //    const nashural: ShowPlaceboardProps[] = data[0];
//         return new ShowPlacesList(u.name, u.group, dataProps as ShowPlacesListData[], 'information') as FeatureBase;
//            // new ShowPlacesList('Ураловед', 'Ураловед', uralovedFiltered as ShowPlacesListData[], 'information'),
//            // new SimplePointsList('Заправки', 'Заправки', data[1], 'fillingstation'),
//            // new ShowPlacesList('Ночевки', 'Ночевки', data[2], 'lodging-2')
//     });
//     features.forEach(f => f.then(v => RegisterFeature(v)));
//     await Promise.all(features).then(() => FeaturesList.featuresList.init(map));
// }

const poi: MetaDataTypeHandler = async (v: MetaData2Row) => {
    const filePath = config.mapPathBin + '/' + v.files[0];
    const [data] = await fetchBinaryData([filePath]);
    const dataProps: PoiBallonProps[] = data;
    return [new PoiList(v.name, v.groupName, dataProps as PoiListData[], 'information')] as Feature[];
}

export function reg(){registerMetaDataTypeHandler('poi', poi)}