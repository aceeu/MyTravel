import { config } from "./config";
import { Route } from "./features/route";
import { fetchBinaryRouteData } from "./bin-loader";
import { MetaData2Row, MetaDataTypeHandler, registerMetaDataTypeHandler } from "./feature-factory";
import { Milestones } from "./features/mile-stones";


const route: MetaDataTypeHandler = async (v: MetaData2Row) => {
    const routeFileData: any[] = await fetchBinaryRouteData(v.files.map(u => config.mapPathBin + '/' + u));
    const res = routeFileData.reduce((a, d, i) => {
        a.push(new Route(v.name, v.groupName, d.geometry, v.color ? v.color[i % v.color.length] : 'blue'));
        if (!v.mileStonesOneForAll)
            a.push(new Milestones(v.name + ' вехи', v.groupName + ' вехи', d.geometry));
        return a;
    },[]);
    if (v.mileStonesOneForAll) {
        const totalGeo = routeFileData.reduce((a, d, i) => {
            return [...a, ...d.geometry]
        }, [])
        res.push(new Milestones(v.name + ' вехи', v.groupName + ' вехи', totalGeo))
    }
    return res;
}

export function reg(){registerMetaDataTypeHandler('route', route)}
