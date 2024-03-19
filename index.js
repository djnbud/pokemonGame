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
const offset = {
  x: -735,
  y: -650,
};


const distanceTravelled = { x: 0, y: 0 };


c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);


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

const battle = {
  initiated: false,
};
const playerUI = {
  open: false,
};


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

let mapRender = new MapRender();
mapRender.startMap("PelletTown", offset, true, 0, {
  x: canvas.width / 2 - 192 / 4 / 2,
  y: canvas.height / 2 - 68 / 2,
},
  () => {
    initInventory();
    animate();
  }
)
