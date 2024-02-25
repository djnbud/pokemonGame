let mapBackground;
let foregroundImage;
let background;
let foreground;
let collisions;
let collisionsMap;
let battleZonesMap;
let battleZonesData;
let boundaries;
let battleZones;

function startMap(location, offset, indoorOrOut, floorLevel) {
    //when true then outside
    if (indoorOrOut === true) {
        createOutsideLocation(location, offset);
    } else {
        createInsideLocation(location, offset, floorLevel);
    }


}

function createOutsideLocation(location, offset) {
    mapBackground = new Image();
    mapBackground.src = "./assets/locations/" + location + "/outsideMap/background.png";

    foregroundImage = new Image();
    foregroundImage.src = "./assets/locations/" + location + "/outsideMap/foreground.png";

    background = new Sprite({
        position: {
            x: offset.x,
            y: offset.y,
        },
        image: mapBackground,
    });

    foreground = new Sprite({
        position: {
            x: offset.x,
            y: offset.y,
        },
        image: foregroundImage,
    });

    fetch('./data/locations/' + location + '/outsideData/collisions.json')
        .then(response => response.json())
        .then(data => resolvedCollisionFile(data))
        .catch(error => console.error('Error fetching JSON:', error))

}

function resolvedCollisionFile(data) {
    collisions = data.collisions;
    collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 70) {
        collisionsMap.push(collisions.slice(i, 70 + i));
    }

    fetch('./data/locations/' + location + '/outsideData/battleZones.json')
        .then(response => response.json())
        .then(data => resolvedBattleZoneFile(data))
        .catch(error => console.error('Error fetching JSON:', error))
}

function resolvedBattleZoneFile(data) {
    battleZonesData = data.battleZonesData;
    battleZonesMap = [];
    for (let i = 0; i < battleZonesData.length; i += 70) {
        battleZonesMap.push(battleZonesData.slice(i, 70 + i));
    }

    setupBoundariesAndInteractionsMap();
}

function setupBoundariesAndInteractionsMap() {
    boundaries = [];
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 1025)
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        },
                    })
                );
        });
    });

    battleZones = [];
    battleZonesMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 1025)
                battleZones.push(
                    new Boundary({
                        boundaryId: 1025,
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        },
                    })
                );
        });
    });
}
