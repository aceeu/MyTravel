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

const routeScheme = new Type({
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
        return routeScheme.decode(Buffer.from(buf));
    })
    return Promise.all(results);
}