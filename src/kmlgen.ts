import * as xmlbuilder from 'xmlbuilder';
import { Feature, FeaturesStorage } from './features/features-list';
import { Route } from './features/route';
import { PoiList, PoiListData } from 'features/show-places';
import { fetchMetaData2 } from './features-init';
import { MetaData2 } from 'feature-factory';

// function networkLink() {
//     return {
//         'name': 'сетевая ссылка',
//         'visibility': 1,
//         'description': 'описание',
//         'Link': {
//             'href': 'http://aceeu.ru/baikal19/',
//         }
//     }
// }

function imageRef(href: string): string {
    return `<img src="${href}" height="200" width="auto" />`;
}

function ahref(href: string): string {
    return `<a href="${href}">Ссылка</a>`;
}

function routeFolder(name: string, coordinates: string): any {
    return {
        'name': name,
        'Placemark': {
            'name': 'route',
            'LineString': {
                'tessellate': 1,
                'coordinates': coordinates
            }
        }
    }

}

interface PlacemarkPoint {
    name: string;
    description: string;
    Point: {
        coordinates: string;
    }
}
function placemarkFolder(name: string, points: PlacemarkPoint[]): any {

    return {
        'name': name,
        'Placemark': [ ...points   ]
    };
}

function makeRouteFolder(routes: Route[]): any[] {
    return routes.reduce((a: any[], r) => {
        if (r.geometries.length == 0)
            return a;
        let coordinates: string[] = r.geometries.map((item: number[]) => `${item[0]},${item[1]},${item[2]}`);
        a.push(routeFolder(r.name, coordinates.join(' ')));
        return a;
    }, []);

}

function makeFeatureFolder(features: Feature[]): any[] {
    // тут надо создать фолдеры для разных типов Feature
    const FolderRoute = {
        'route': makeRouteFolder,
        'poi': placemarkFolder
    }
    return features.reduce((a: any[], f: Feature) => {
        if (f.getType() == 'route') {
            a.push(makeRouteFolder([f as Route]))
        } else if (f.getType() == 'poi') {
            const poiList = f as PoiList
            a.push(placemarkFolder(f.name, makePlacemarkPoint(poiList.data))) 
        }
        return a

    }, [])

        // const mainRoutes: Route[] = FeaturesStorage.featuresList.findFeatures('Основной маршрут') as Route[];
    // // const folders: any[] = makeRouteFolder(mainRoutes);

    // const poiMainfeature: PoiList[] = FeaturesStorage.featuresList.findByGroupName('Достопримечательности') as PoiList[];
    // const folders: any = poiMainfeature.map(f => placemarkFolder(f.name, makePlacemarkPoint(f.data)));
    // // const constMPointsFolder = placemarkFolder('Main POI', makePlacemarkPoint(poiMainfeature.data));
    // // const poifeature: ShowPlacesList = FeaturesList.featuresList.find(
    // //         ['Достопримечательности']) as ShowPlacesList;
    // // const constPointsFolder = placemarkFolder('POI', makePlacemarkPoint(poifeature.data));
    // return kmlgen(name, [makeRouteFolder(mainRoutes), ...folders]);
}

function makePlacemarkPoint(poifeatureData: PoiListData[]): PlacemarkPoint[] {
    return poifeatureData.map(v => {
        const imgurl = v.imageUrl || '';
        let description: string = imageRef(imgurl)
            + '<br>' + (v.text ? v.text : '') + ' ' + 
            (v.hrefs ? v.hrefs.map(h => ahref(h)).join(' ') : '')
        return {
            name: v.name,
            description ,
            Point: {
                coordinates: `${v.position[1]},${v.position[0]}`
            }}
        });
}

export async function genKmlMainroute(name: string): Promise<string> {

    const metaData2: MetaData2 = await fetchMetaData2()
    
    //const routes = metaData2.data.filter(d => d.type == 'route')
    function onlyUnique(value: any, index: number, array: any[]) {
        return array.indexOf(value) === index;
    }
    const groupNames: string[] = metaData2.data.map(r => r.groupName).filter(onlyUnique)

    const feaures: any[] = groupNames.map(gn => {
        const rf: Feature[] = FeaturesStorage.featuresList.findFeatures(gn)
        return makeFeatureFolder(rf)
    })
    return kmlgen(name, feaures)


}

export function genKmlAltRoutes(name: string): string {
    // alternatives
    const alt: Route[] = FeaturesStorage.featuresList.findFeatures('Дополнительные маршруты') as Route[];
    // const tyva: Route[] = FeaturesList.featuresList.findFeatures('Тыва') as Route[];
    return kmlgen(name, makeRouteFolder(alt));
}

function kmlgen(name: string, folders: any[]): string {
    // const coordinates = '47.17597,56.07961,0 47.17143,56.07838,0 47.14493,56.08101,0 47.12656,56.08467,0';
    const obj = {
        kml: {
            '@xmlns': 'http://www.opengis.net/kml/2.2',
            'Document': {
                'name': name,
                'Folder': [
                    ...folders
                ]
            },
        }
    }
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?> ';
    return xmlHeader + xmlbuilder.create(obj, { encoding: 'utf-8' })
}