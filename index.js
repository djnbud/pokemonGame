const canvas = document.querySelector("#canvas");
const canvas2 = document.querySelector("#canvas2");
document.querySelector("#dialogueBox").style.visibility = "hidden";
const c = canvas.getContext("2d");
const c2 = canvas2.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
canvas2.width = 1024;
canvas2.height = 576;
canvas2.setAttribute("hidden", "hidden");
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
const distanceTravelled = { x: 0, y: 0 };
const boundaries = [];
const offset = {
  x: -735,
  y: -650,
};
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

const battleZones = [];

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

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const map = new Image();
map.src = "./assets/PelletTown.png";

const foregroundImage = new Image();
foregroundImage.src = "./assets/foreground.png";

const playerDownImage = new Image();
playerDownImage.src = "./assets/player/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./assets/player/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./assets/player/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./assets/player/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
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

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: map,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  i: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battleZones];
const renderables = [background, ...boundaries, player, foreground];
const battle = {
  initiated: false,
};
const playerUI = {
  open: false,
};
initInventory();
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "i":
      keys.i.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "i":
      keys.i.pressed = false;
      break;
  }
});
let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
