import * as xmlbuilder from 'xmlbuilder';
import { FeaturesList } from './features/features-list';
import { Route } from './features/route';
import { ShowPlacesList } from 'features/show-places';

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

export function generateKml() {
    let i = 0;
    let routes: Route[] = []
    while (1) {
        const r = FeaturesList.featuresList.find(['r' + i]) as Route;
        ++i;
        if (r) routes.push(r);
        else break;
    }

    const folders = routes.map(r => {
        if (r.geometries.length == 0)
            throw 'geometries empty';
        let startitm = r.geometries[0];
        const enditem = r.geometries[r.geometries.length -1];
        const start = `${startitm[1]},${startitm[0]},${startitm[2]}`;
        const end = `${enditem[1]},${enditem[0]},${enditem[2]}`;
        let coordinates: string[] = r.geometries.map((item: number[]) => `${item[1]},${item[0]},${item[2]}`);
        return routeFolder(r.name, coordinates.join(' '));

    });
    const poifeature = FeaturesList.featuresList.find(
        ['Основные Достопримечательности', 'Достопримечательности']) as ShowPlacesList;
    if (!poifeature)
        throw 'cannot find Достопримечательности';
    const points: PlacemarkPoint[] = poifeature.data.map(v => {
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
    const constPointsFolder = placemarkFolder('POI', points);
    return kmlgen([constPointsFolder, ...folders]);
}

function kmlgen(folders: any[]): string {
    // const coordinates = '47.17597,56.07961,0 47.17143,56.07838,0 47.14493,56.08101,0 47.12656,56.08467,0';
    const obj = {
        kml: {
            '@xmlns': 'http://www.opengis.net/kml/2.2',
            'Document': {
                'name': 'Байкал 2019',
                'Folder': [
                    ...folders
                ]
            },
        }
    }
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    return xmlHeader + ' ' + xmlbuilder.create(obj, { encoding: 'utf-8' })
}