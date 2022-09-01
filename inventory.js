let pokeballs = new Map();

function initInventory() {
    //normally here we will check what player has in inventory such as potions and pokeballs
    //for now we will give player the same on init
    pokeballs.set("pokeball", { amount: 10 });
}

function usePokeball(name) {
    if (pokeballs.has(name)) {
        let currentPokeBalls = pokeballs.get(name);
        if (currentPokeBalls.amount > 0) {
            currentPokeBalls.amount -= 1;
            pokeballs.set(name, currentPokeBalls);
            return true;
        }
    }
    return false;
}
function getPokeballs() {
    return pokeballs;
}
