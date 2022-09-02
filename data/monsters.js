const monsters = {
    Emby: {
        position: { x: 280, y: 325 },
        image: { src: "./assets/embySprite.png" },
        frames: { max: 4, hold: 30 },
        animate: true,
        name: "Emby",
        level: 1,
        experience: 0,
        attacks: [attacks.Tackle, attacks.Fireball],
    },
    Draggle: {
        position: { x: 800, y: 100 },
        image: { src: "./assets/draggleSprite.png" },
        frames: { max: 4, hold: 30 },
        animate: true,
        isEnemy: true,
        name: "Draggle",
        level: 1,
        experience: 0,
        attacks: [attacks.Tackle, attacks.Fireball],
    },
};
