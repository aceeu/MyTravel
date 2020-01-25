var { Type } = require('js-binary');
let fs = require("fs");

let scheme = new Type(
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

const routeScheme = new Type({ // utf-8 without BOM
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

let path = './src/assets/data/ural20/';


// interface MetaData {
//     routeFiles: string[],
//     alternates: string[],
//     urls: string[]
// }


function fetchMetaData() { // MetaData
    let content = fs.readFileSync(path + 'metadata.json');
    return JSON.parse(content);
}

const metadata = fetchMetaData();

const processRoute = scheme => urlItem => {
    let content = fs.readFileSync(path + urlItem.filename);
    console.log(urlItem.filename);
    const fname = urlItem.filename.split('.')[0];
    let res = scheme.encode(JSON.parse(content));
    fs.writeFileSync(path + 'bin/' + fname + '.bin', res);
};

metadata.urls.forEach(processRoute(scheme));
metadata.routeFiles.forEach(processRoute(routeScheme2));
metadata.alternates.forEach(processRoute(routeScheme2));


// let content = fs.readFileSync(path + 'show-places-data.json.bin');
// let decoded = scheme.decode(content);
// console.log(JSON.stringify(decoded));

