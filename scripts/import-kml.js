const parseKml = require('parse-kml')
const fs = require('fs')
const metadataPath = './src/assets/data/';

// импорт kml файла который был получен из карты  https://www.google.com/maps/d/viewer?mid=13OgvN0wYEXEJ6kj6vc5ezRs634jwDfv5&hl=ru&ll=66.21028888325083%2C30.489414960620003&z=13

parseKml.toJson('C://Users//aceeu//Downloads//Паанаярви, национальный парк.kml')
    .then(o => {
        //fs.writeFileSync(metadataPath + 'paanayarvi-poi.kml.json', JSON.stringify(o));
        const json = transform(o);
        fs.writeFileSync(metadataPath + 'paanayarvi-poi.json', JSON.stringify(json, undefined, 4));
        console.log('import kml ok');
    }).catch(console.error)

const icon_map = {
    '1603': 'house',
    //'1603': 'house',
    '1764': 'capmfire',
    '1643': 'optometrist-eye',
    '1644': 'parking',
    '1623': 'marine-anchor',
    '1803': 'here',
    '1765': 'camping-tent',
    '1608': 'info',
    '1670': 'religious-christian'
}
    

function poiImport(o) {
    if (o && o.type == 'Feature' && o.geometry && o.geometry.type == 'Point') {
        const icon = icon_map[o.properties.styleUrl.split('-')[1]] || 'info'
        return {
            name: o.properties.name,
            position: [o.geometry.coordinates[1], o.geometry.coordinates[0]],
            imageUrl: o.properties.gx_media_links,
            text: o.properties.description,
            hrefs: [],
            icon
        }
    }
}

function routeImport(o) {
    if (o && o.type == 'Feature' && o.geometry && o.geometry.type == 'LineString') {
        fs.writeFileSync(metadataPath + o.properties.name + '.json', JSON.stringify({
            geometry: o.geometry.coordinates.map(v => [v[1], v[0]]),
            name:o.properties.name,
            description: o.properties.description,
            stroke: o.properties.stroke
        }, undefined, 4));
    }
}

function transform(kmlObject) {
    return kmlObject.features.reduce((a, f) => {
        const p = poiImport(f);
        if (p)
            a.push(p);
        else
            routeImport(f);
        return a;
    }, []);

}