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
    }
);

let path = './dist/ural20/';


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
metadata.routeFiles.forEach(processRoute(routeScheme));
metadata.alternates.forEach(processRoute(routeScheme));


// let content = fs.readFileSync(path + 'show-places-data.json.bin');
// let decoded = scheme.decode(content);
// console.log(JSON.stringify(decoded));

