var polyUtil = require('polyline-encoded');

// var encoded = "_p~iF~cn~U_ulLn{vA_mqNvxq`@";
// var latlngs = polyUtil.decode(encoded);
// console.log(latlngs)

const fs = require('fs')
const metadataPath = './src/assets/data/';


// конвертируем координаты в строку
const filename = metadataPath + 'Чебоксары-паанаярви.json'
const content = fs.readFileSync(filename)
const c = JSON.parse(content)

const latlngs = c.geometry;
const str = polyUtil.encode(latlngs)
console.log(str) // строка