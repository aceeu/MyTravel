import { config } from "./config";
import { ShowPlaceboardProps } from "./controls/show-place-board";
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";
import { Feature } from "./features/features-list";
import { ShowPlacesList, ShowPlacesListData } from "./features/show-places";
import { fetchBinaryData } from "./fetch-showplaces";

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
    const dataProps: ShowPlaceboardProps[] = data;
    return [new ShowPlacesList(v.name, v.groupName, dataProps as ShowPlacesListData[], 'information')] as Feature[];
}

export function reg(){registerMetaDataTypeHandler('poi', poi)}