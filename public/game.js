// Your game config
const game = new Phaser.Game({
  title: "GridEngineExample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scale: {
    width: 720,
    height: 528,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },

  parent: "game",
  backgroundColor: "#48C4F8",
});

function preload() {
  this.load.image("tiles", "assets/cloud_tileset.png");
  this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud_city.json");
  this.load.spritesheet("player", "assets/characters.png", {
    frameWidth: 52,
    frameHeight: 72,
  });
}

function create() {
  const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
  cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
  for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
    const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
    layer.scale = 3;
  }
  const playerSprite = this.add.sprite(0, 0, "player");
  playerSprite.scale = 1.5;

  const npcSprite = this.add.sprite(0, 0, "player");
  npcSprite.scale = 1.5;
  this.cameras.main.startFollow(playerSprite, true);
  this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

  const gridEngineConfig = {
    characters: [
      {
        id: "player",
        sprite: playerSprite,
        walkingAnimationMapping: 6,
        startPosition: { x: 8, y: 8 },
      },
      {
        id: "npc1",
        sprite: npcSprite,
        walkingAnimationMapping: 1,
        startPosition: { x: 11, y: 12 },
      },
    ],
  };

  this.gridEngine.create(cloudCityTilemap, gridEngineConfig);

  // EXPOSE TO EXTENSION
  window.__GRID_ENGINE__ = this.gridEngine;
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    this.gridEngine.move("player", "left");
  } else if (cursors.right.isDown) {
    this.gridEngine.move("player", "right");
  } else if (cursors.up.isDown) {
    this.gridEngine.move("player", "up");
  } else if (cursors.down.isDown) {
    this.gridEngine.move("player", "down");
  }
}
