import * as xmlbuilder from 'xmlbuilder';
import { FeaturesList, Feature } from './features/features-list';
import { Route } from './features/route';
import { ShowPlacesList, ShowPlacesListData } from 'features/show-places';

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
        let startitm = r.geometries[0];
        const enditem = r.geometries[r.geometries.length -1];
        // const start = `${startitm[1]},${startitm[0]},${startitm[2]}`;
        // const end = `${enditem[1]},${enditem[0]},${enditem[2]}`;
        let coordinates: string[] = r.geometries.map((item: number[]) => `${item[1]},${item[0]},${item[2]}`);
        a.push(routeFolder(r.name, coordinates.join(' ')));
        return a;
    }, []);

}

function makePlacemarkPoint(poifeatureData: ShowPlacesListData[]): PlacemarkPoint[] {
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

export function genKmlMainroute(name: string): string {
    const mainRoutes: Route[] = FeaturesList.featuresList.findFeatures('Основной маршрут') as Route[];
    // const folders: any[] = makeRouteFolder(mainRoutes);

    const poiMainfeature: ShowPlacesList[] = FeaturesList.featuresList.findByGroupName('Достопримечательности на маршруте') as ShowPlacesList[];
    const folders: any = poiMainfeature.map(f => placemarkFolder(f.name, makePlacemarkPoint(f.data)));
    // const constMPointsFolder = placemarkFolder('Main POI', makePlacemarkPoint(poiMainfeature.data));
    // const poifeature: ShowPlacesList = FeaturesList.featuresList.find(
    //         ['Достопримечательности']) as ShowPlacesList;
    // const constPointsFolder = placemarkFolder('POI', makePlacemarkPoint(poifeature.data));
    return kmlgen(name, [makeRouteFolder(mainRoutes), ...folders]);
}

export function genKmlAltRoutes(): string {
    // alternatives
    const alt: Route[] = FeaturesList.featuresList.findFeatures('Дополнительные маршруты') as Route[];
    const tyva: Route[] = FeaturesList.featuresList.findFeatures('Тыва') as Route[];
    return kmlgen('Байкал19-альтернативы', makeRouteFolder([...alt, ...tyva]));
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
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    return xmlHeader + ' ' + xmlbuilder.create(obj, { encoding: 'utf-8' })
}