import { config } from "./config";
import { Route } from "./features/route";
import { fetchBinaryRouteData } from "./bin-loader";
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";
import { Milestones } from "./features/mile-stones";
import { LayerGroupFeature } from './features/features-list';

interface RouteJSON {
    geometry: number[][],
    name: string,
    description: string,
    stroke: string
}

const route: MetaDataTypeHandler = async (v: MetaData2Row) => {
    const routeFileData: RouteJSON[] = await fetchBinaryRouteData(v.files.map(u => config.mapPathBin + '/' + u));
    const res = routeFileData.reduce((a: LayerGroupFeature[] , d: RouteJSON, i: number) => {
        a.push(new Route(v.name, v.groupName, d.geometry, v.color && v.color[i] || d.stroke, d.description));
        if (!v.mileStonesOneForAll)
            a.push(new Milestones(v.name + ' вехи', v.groupName + ' вехи', d.geometry));
        return a;
    }, []);
    if (v.mileStonesOneForAll) {
        const totalGeo = routeFileData.reduce((a: number[][] , d: RouteJSON, i: number) => {
            a.concat(d.geometry)
            return a
        }, [])
        res.push(new Milestones(v.name + ' вехи', v.groupName + ' вехи', totalGeo))
    }
    return res;
}

export function reg(){registerMetaDataTypeHandler('route', route)}
