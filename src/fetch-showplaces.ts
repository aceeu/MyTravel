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
        'presntNum?': 'uint'
    }]
);

export function fetchBinaryData(urls: string[]): Promise<any[]> {
    const results = urls.map(async (url, i) => {
        const response = await fetch(url + '.bin');
        const buf = await response.arrayBuffer();
        return scheme.decode(Buffer.from(buf));
    })
    return Promise.all(results);
}