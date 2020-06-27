let {SpriteGenerator} = require('./sprite-generator/build/sprite-generator');

let spriteGenerator = new SpriteGenerator({
  sprites: [
    {name: 'icons', sourceFolder: 'src/assets/icons'},
  ],
  targetFolder: {
    icons: 'src/gen/sprites',
    scss: 'src/gen/sprites',
    ts: 'src/gen/sprites'
  },
  classes: {
    base: 'i',
    sprite: 's',
    size: 'x',
    icon: 'i'
  },
  url: `'./#SPRITE_FILE'`
});

spriteGenerator.generate();
