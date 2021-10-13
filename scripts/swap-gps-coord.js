const fs = require('fs')
const metadataPath = './src/assets/data/';


// меняет местами lat-long
const filename = metadataPath + 'Чебоксары-паанаярви.json'
const content = fs.readFileSync(filename)
const c = JSON.parse(content)
c.geometry = c.geometry.map(v => [v[1], v[0], v[2]])
fs.writeFileSync(filename + '.1', JSON.stringify(c))
