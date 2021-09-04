import { Type } from 'js-binary';

// ShowPlaceboardProps

let scheme = new Type( // the same as in data-gen.js
    [{
        'icon?': 'string',
        name: 'string',
        position: ['float'],
        'imageUrl?': 'string',
        'youtube?': 'string',
        'text?': 'string',
        'hrefs?': ['string'],
        'gravity?': 'uint'
    }]
);

const mongolRouteScheme = new Type({ // utf-8 without BOM
    'warnings?': [
        {
            code: 'uint',
            message: 'string'
        }
    ],
    elevation: 'boolean',
    summary: {
        distance: 'float',
        duration: 'float',
        ascent: 'float',
        descent: 'float'
    },
    geometry_format: 'string',
    geometry: [
        ['float']
    ],
    segments: [
        {
            distance: 'float',
            duration: 'float',
            ascent: 'float',
            descent: 'float',
            detourfactor: 'float',
            percentage: 'float',
            steps: [
                {
                    distance: 'float',
                    duration: 'float',
                    type: 'int',
                    instruction: 'string',
                    way_points: ['int'],
                    'distanceTurf?': 'float'
                }
            ]
        }
    ],
    way_points: ['int'],
    bbox: ['float']
});

const routeScheme2 = new Type({ // utf-8 without BOM
    // новый формат из https://maps.openrouteservice.org/directions?n1=55.206304&n2=58.6409&n3=9&a=55.82954,56.91459,55.203344,58.630347,55.153718,58.691738,55.13816,58.726674&b=0&c=0&k1=en-US&k2=km&s
    bbox: ['float'],
    type: 'string',
    properties: {
        ascent: 'float',
        descent: 'float',
        segments: [
            {
                distance: 'float',
                duration: 'float',
                ascent: 'float',
                descent: 'float',
                detourfactor: 'float',
                percentage: 'float',
                steps: [
                    {
                        distance: 'float',
                        duration: 'float',
                        type: 'int',
                        instruction: 'string',
                        way_points: ['int'],
                        'distanceTurf?': 'float'
                    }
                ]
            }
        ],
        extras: {
            surface: {
                values: [
                    ['int']
                ],
                summary: [
                    {
                        value: 'int',
                        distance: 'float',
                        amount: 'float'
                    }
                ]
            },
            waytypes: {
                values: [
                    ['int']
                ],
                summary: [
                    {
                        value: 'int',
                        distance: 'float',
                        amount: 'float'
                    }
                ]
            },
            steepness: {
                values: [
                    ['int']
                ],
                summary: [
                    {
                        value: 'int',
                        distance: 'float',
                        amount: 'float'
                    }
                ]
            }
        },
        summary: {
            distance: 'float',
            duration: 'float'
        },
        way_points: ['int']
    },
    geometry: [
        ['float']
    ],
    'warnings?': [
        {
            code: 'uint',
            message: 'string'
        }
    ],
});

export function fetchBinaryData(urls: string[]): Promise<any[]> {
    const results = urls.map(async (url, i) => {
        const urlBinFile = url.replace('.json', '.bin');
        const response = await fetch(urlBinFile);
        const buf = await response.arrayBuffer();
        return scheme.decode(Buffer.from(buf));
    })
    return Promise.all(results);
}

export function fetchBinaryRouteData(urls: string[]): Promise<any[]> {
    const results = urls.map(async (url, i) => {
        const urlBinFile = url.replace('.json', '.bin');
        const response = await fetch(urlBinFile);
        const buf = await response.arrayBuffer();
        //return routeScheme2.decode(Buffer.from(buf));
        return mongolRouteScheme.decode(Buffer.from(buf));
    })
    return Promise.all(results);
}