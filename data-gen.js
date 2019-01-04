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
        'hrefs?': ['string']
    }]
);
    
let filenames = ["show-places-data.json","gas-station.json","overnight-stay.json"];
let path = "./dist/mongol19/";

filenames.forEach((filename, i) => {
    let content = fs.readFileSync(path + filename);
    let res = scheme.encode(JSON.parse(content));
    fs.writeFileSync(path + filename + '.bin', res);
});

// let content = fs.readFileSync(path + 'show-places-data.json.bin');
// let decoded = scheme.decode(content);
// console.log(JSON.stringify(decoded));

