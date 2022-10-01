let playerPokeballs = new Map();

let storedPokemon = new Map();
let localPokemon = new Map();
let localItems = new Map();

function initInventory() {
  //normally here we will check what player has in inventory such as potions and pokeballs
  //for now we will give player the same on init
  playerPokeballs.set("pokeball", { amount: 10 });
  localPokemon.set(0, {
    id: "Emby",
    nickname: "Emby",
    details: {
      level: 5,
      attacks: [attacks.Tackle, attacks.Fireball],
      health: 45,
      maxHealth: 45,
      experience: 0,
      attackStat: 49,
      defenseStat: 49,
      speedStat: 49,
    },
  });
  let startPokemon = localPokemon.get(0);
  let updatedPlayerPokemonStats = statCalculator(
    startPokemon.details,
    monsters[startPokemon.id]
  );

  startPokemon.details.maxHealth = updatedPlayerPokemonStats.newHealth;
  startPokemon.details.health = updatedPlayerPokemonStats.newHealth;
  startPokemon.details.attackStat = updatedPlayerPokemonStats.newAttack;
  startPokemon.details.defenseStat = updatedPlayerPokemonStats.newDefense;
  startPokemon.details.speedStat = updatedPlayerPokemonStats.newSpeed;

  storedPokemon.set("localStorage", localPokemon);
  storedPokemon.set("pcStorage", []);

  setLocalPokemon(0, startPokemon);

  localItems.set("potion", { amount: 5 });
}

function usePokeball(name) {
  if (playerPokeballs.has(name)) {
    let currentPokeBalls = playerPokeballs.get(name);
    if (currentPokeBalls.amount > 0) {
      currentPokeBalls.amount -= 1;
      playerPokeballs.set(name, currentPokeBalls);
      return true;
    }
  }
  return false;
}
function getPokeballs() {
  return playerPokeballs;
}

function getstoredPokemon() {
  return storedPokemon;
}

function getItems() {
  return localItems;
}

function getLocalStoredPokemon() {
  return storedPokemon.get("localStorage");
}

function getPcStoredPokemon() {
  return storedPokemon.get("pcStorage");
}

function setLocalPokemon(index, details) {
  let localPokemon = storedPokemon.get("localStorage");
  localPokemon.set(index, details);
}

function setItem(id, details) {
  localItems.set(id, details);
}

function checkAllLocalPokemonHealth() {
  let localPokemon = storedPokemon.get("localStorage");
  for (let [key, value] of localPokemon) {
    if (value.details.health > 0) {
      return true;
    }
  }
  return false;
}
//For if all pokemon are fainted during a battle so need to heal them back to full
//Or when visiting poke centre
function healAllLocalPokemon() {
  let localPokemon = storedPokemon.get("localStorage");
  localPokemon.forEach((value, key) => {
    value.details.health = value.details.maxHealth;
  });
}

function addPokemonToStorage(pokemon, nickname) {
  //when retrieved a new pokemon check if room in storage
  let localStorage = getLocalStoredPokemon();
  let pcStorage = getPcStoredPokemon();
  if (localStorage.size < 6) {
    localStorage.set(localStorage.size, {
      id: pokemon.name,
      nickname: nickname,
      details: {
        level: pokemon.level,
        attacks: pokemon.attacks,
        health: pokemon.maxHealth,
        maxHealth: pokemon.maxHealth,
        experience: pokemon.experience,
        attackStat: pokemon.attackStat,
        defenseStat: pokemon.defenseStat,
        speedStat: pokemon.speedStat,
      },
    });
  } else {
    pcStorage.push({
      id: pokemon.name,
      nickname: nickname,
      details: {
        level: pokemon.level,
        attacks: pokemon.attacks,
        health: pokemon.maxHealth,
        maxHealth: pokemon.maxHealth,
        experience: pokemon.experience,
        attackStat: pokemon.attackStat,
        defenseStat: pokemon.defenseStat,
        speedStat: pokemon.speedStat,
      },
    });
  }
}
