import { config } from "./config";
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";
import { Feature } from "./features/features-list";
import { SimplePointsList } from "./features/simple-points";
import { fetchBinaryPoiRouteData } from "./bin-loader";


const pos_route: MetaDataTypeHandler = async (v: MetaData2Row) => {
    const filePath = config.mapPathBin + '/' + v.files[0];
    const [data] = await fetchBinaryPoiRouteData([filePath]);
    return [new SimplePointsList(v.name, v.groupName, data.pos_route, 'flag')] as Feature[];
}

export function reg(){registerMetaDataTypeHandler('pos_route', pos_route)}