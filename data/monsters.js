const monsters = {
    Emby: {
        position: { x: 280, y: 325 },
        enemyPosition: { x: 800, y: 100 },
        image: { src: "./assets/embySprite.png" },
        frames: { max: 4, hold: 30 },
        animate: true,
        name: "Emby",
        level: 1,
        levelingType: "mediumFast",
        health: 100,
        maxHealth: 100,
        experience: 0,
        attacks: [attacks.Tackle, attacks.Fireball],
        baseExpYield: 58,
    },
    Draggle: {
        position: { x: 280, y: 325 },
        enemyPosition: { x: 800, y: 100 },
        image: { src: "./assets/draggleSprite.png" },
        frames: { max: 4, hold: 30 },
        animate: true,
        isEnemy: true,
        name: "Draggle",
        level: 10,
        levelingType: "fast",
        health: 100,
        maxHealth: 100,
        experience: 0,
        attacks: [attacks.Tackle, attacks.Fireball],
        baseExpYield: 35,
    },
};
