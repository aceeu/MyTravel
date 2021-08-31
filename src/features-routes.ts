import { MetaData } from "./features-init";
import { config } from "./config";
import { Feature, RegisterFeature } from "./features/features-list";
import { MilestonesList } from "./features/mile-stones";
import { Route } from "./features/route";
import { fetchBinaryRouteData } from "./fetch-showplaces";
import { getStep } from './math';
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";


// export async function MainRoutes(metaData: MetaData) {
//     const routeFiles: string[] = metaData.routeFiles.map(f => f.filename)
//     const results: any[] = await fetchBinaryRouteData(routeFiles.map(u => config.mapPathBin + '/' + u));
//     const geos: any[] = results.map(r => r.geometry);
//     const color = (i: number) => palette[i % palette.length];
//     geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Основной маршрут', r, color(i))))
//     RegisterFeature(new MilestonesList('Вехи', 'Основной маршрут', [].concat(...geos)));
// }

// export async function ARoute(metaData: MetaData) {
//     const alternates: string[] = metaData.alternates.map(f => f.filename)
//     const name = 'Дополнительные маршруты'
//     const color = '#0000ff'
//     const results: any[] = await fetchBinaryRouteData(alternates.map(u => config.mapPathBin + '/' + u));
//     results.forEach((r, i) => {
//         RegisterFeature(new Route(name + i, name, r.geometry, color));
//         RegisterFeature(new MilestonesList(name + i, name , r.geometry,
//             Math.ceil(getStep(r.properties.summary.distance, 8)), color));
//     });
// }

const route: MetaDataTypeHandler = async (v: MetaData2Row) => {
    const routeFileData: any[] = await fetchBinaryRouteData(v.files.map(u => config.mapPathBin + '/' + u));
    const geos: any[] = routeFileData.map(r => r.geometry);
    return geos.map((r, i) => new Route(v.name, v.groupName, r, v.color[i]));
}

export function reg(){registerMetaDataTypeHandler('route', route)}