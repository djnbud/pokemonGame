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
        details: { level: 1, attacks: [attacks.Tackle, attacks.Fireball], health: 100, maxHealth: 100, experience: 0 },
    });
    storedPokemon.set("localStorage", localPokemon);
    storedPokemon.set("pcStorage", []);

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
            },
        });
    } else {
        pcStorage.push({
            id: pokemon.name,
            nickname: nickname,
            details: { level: pokemon.level, attacks: pokemon.attacks },
        });
    }
}
