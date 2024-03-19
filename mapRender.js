class MapRender {
    constructor() {
        this.offset;
        this.location;
        this.background;
        this.foreground;
        this.collisionsMap;
        this.battleZonesMap;
        this.boundaries;
        this.battleZones;
        this.onComplete;
        this.movables;
        this.renderables;
        this.player = null;
    }

    startMap(location, offset, indoorOrOut, floorLevel, playerPosition, onComplete) {
        this.offset = offset;
        this.location = location;
        this.onComplete = onComplete;

        if (this.player === null) {
            this.createPlayer(playerPosition);
        }
        //when true then outside
        if (indoorOrOut === true) {
            this.createOutsideLocation();
        } else {
            this.createInsideLocation(floorLevel);
        }
    }

    createPlayer(playerPosition) {
        const playerDownImage = new Image();
        playerDownImage.src = "./assets/player/playerDown.png";

        const playerUpImage = new Image();
        playerUpImage.src = "./assets/player/playerUp.png";

        const playerLeftImage = new Image();
        playerLeftImage.src = "./assets/player/playerLeft.png";

        const playerRightImage = new Image();
        playerRightImage.src = "./assets/player/playerRight.png";

        this.player = new Sprite({
            playerPosition,
            image: playerDownImage,
            frames: {
                max: 4,
                hold: 10,
            },
            sprites: {
                up: playerUpImage,
                left: playerLeftImage,
                right: playerRightImage,
                down: playerDownImage,
            },
        });
    }

    createInsideLocation(floorLevel) { }

    createOutsideLocation() {
        let mapBackground = new Image();
        mapBackground.src = "./assets/locations/" + this.location + "/outsideMap/background.png";

        let foregroundImage = new Image();
        foregroundImage.src = "./assets/locations/" + this.location + "/outsideMap/foreground.png";

        this.background = new Sprite({
            position: {
                x: this.offset.x,
                y: this.offset.y,
            },
            image: mapBackground,
        });

        this.foreground = new Sprite({
            position: {
                x: this.offset.x,
                y: this.offset.y,
            },
            image: foregroundImage,
        });

        fetch('./data/locations/' + this.location + '/outsideData/collisions.json')
            .then(response => response.json())
            .then(data => this.resolvedCollisionFile(data))
            .catch(error => console.error('Error fetching JSON:', error))

    }

    resolvedCollisionFile(data) {
        let collisions = data.collisions;
        this.collisionsMap = [];
        for (let i = 0; i < collisions.length; i += 70) {
            this.collisionsMap.push(collisions.slice(i, 70 + i));
        }

        fetch('./data/locations/' + this.location + '/outsideData/battleZones.json')
            .then(response => response.json())
            .then(data => this.resolvedBattleZoneFile(data))
            .catch(error => console.error('Error fetching JSON:', error))
    }

    resolvedBattleZoneFile(data) {
        let battleZonesData = data.battleZonesData;
        this.battleZonesMap = [];
        for (let i = 0; i < battleZonesData.length; i += 70) {
            this.battleZonesMap.push(battleZonesData.slice(i, 70 + i));
        }

        this.setupBoundariesAndInteractionsMap();
    }

    setupBoundariesAndInteractionsMap() {
        this.boundaries = [];
        this.collisionsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 1025)
                    this.boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y,
                            },
                        })
                    );
            });
        });

        this.battleZones = [];
        this.battleZonesMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 1025)
                    this.battleZones.push(
                        new Boundary({
                            boundaryId: 1025,
                            position: {
                                x: j * Boundary.width + this.offset.x,
                                y: i * Boundary.height + this.offset.y,
                            },
                        })
                    );
            });
        });

        this.movables = [this.background, ...this.boundaries, this.foreground, ...this.battleZones];
        this.renderables = [this.background, ...this.boundaries, player, this.foreground];

        this.onComplete && this.onComplete();
    }
}
