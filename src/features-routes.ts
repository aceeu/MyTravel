import { MetaData } from "./features-init";
import { config } from "./config";
import { RegisterFeature } from "./features/features-list";
import { MilestonesList } from "./features/mile-stones";
import { Route } from "./features/route";
import { fetchBinaryRouteData } from "./fetch-showplaces";
import { getStep } from './math';

const palette: string[] = [
    '#990000', '#1c6597', '#bc832d', '#466a33', '#d0342a', '#125f6a', '#f47955', '#8c5892', '#a99f2e', '#ffce07', '#32a9b2'
];

export async function MainRoutes(metaData: MetaData) {
    const routeFiles: string[] = metaData.routeFiles.map(f => f.filename)
    const results: any[] = await fetchBinaryRouteData(routeFiles.map(u => config.mapPathBin + '/' + u));
    const geos: any[] = results.map(r => r.geometry);
    const color = (i: number) => palette[i % palette.length];
    geos.forEach((r, i) => RegisterFeature(new Route('r' + i, 'Основной маршрут', r, color(i))))
    RegisterFeature(new MilestonesList('Вехи', 'Основной маршрут', [].concat(...geos), undefined, undefined, 'black'));
}

export async function ARoute(metaData: MetaData) {
    const alternates: string[] = metaData.alternates.map(f => f.filename)
    const name = 'Дополнительные маршруты'
    const color = '#0000ff'
    const results: any[] = await fetchBinaryRouteData(alternates.map(u => config.mapPathBin + '/' + u));
    results.forEach((r, i) => {
        RegisterFeature(new Route(name + i, name, r.geometry, color));
        RegisterFeature(new MilestonesList(name + i, name , r.geometry,
            Math.ceil(getStep(r.properties.summary.distance, 8)), [9, 14], color));
    });
}
