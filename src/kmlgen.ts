import * as xmlbuilder from 'xmlbuilder';
import { FeaturesList } from './features/features-list';
import { Route } from './features/route';

function networkLink() {
    return {
        'name': 'сетевая ссылка',
        'visibility': 1,
        'description': 'описание',
        'Link': {
            'href': 'http://aceeu.ru/baikal19/',
        }
    }
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

export function generateKml() {
    const route = FeaturesList.featuresList.find('r1') as Route;
    if (route.geometries.length == 0)
        throw 'geometries empty';
    let startitm = route.geometries[0];
    const enditem = route.geometries[route.geometries.length -1];
    const start = `${startitm[1]},${startitm[0]},${startitm[2]}`;
    const end = `${enditem[1]},${enditem[0]},${enditem[2]}`;
    let coordinates: string[] = route.geometries.map((item: number[]) => `${item[1]},${item[0]},${item[2]}`);
    return kmlgen(start, end, coordinates.join(' '));
}

function kmlgen(start: string, end: string, coordinates: string): string {
    // const coordinates = '47.17597,56.07961,0 47.17143,56.07838,0 47.14493,56.08101,0 47.12656,56.08467,0';
    const obj = {
        kml: {
            '@xmlns': 'http://www.opengis.net/kml/2.2',
            'Document': {
                'name': 'Байкал 2019',
                'Folder': [{
                    'name': '----',
                    'Placemark': 
                    [   {
                            'name': 'start',
                            'Point': {
                                'coordinates': start
                            }
                        },
                        {
                            'name': 'end',
                            'Point': {
                                'coordinates': end
                            },
                            'NetworkLink': networkLink()
                        }
                    ]
                }, routeFolder('Маршрут первого этапа', coordinates)
                ]
            },
        }
    }
    return xmlbuilder.create(obj, { encoding: 'utf-8' })
}