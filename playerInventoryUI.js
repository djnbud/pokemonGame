function initPlayerInv() {
    document.querySelector("#pokemonPlayerInv").addEventListener("click", (e) => {
        showPokemonBag();
    });
    document.querySelector("#pokemonStoragePlayerInv").addEventListener("click", (e) => {});

    document.querySelector("#pokedexPlayerInv").addEventListener("click", (e) => {});
    document.querySelector("#itemsPlayerInv").addEventListener("click", (e) => {});
    document.querySelector("#closePlayerInv").addEventListener("click", (e) => {
        closePlayerInventory();
    });
    keys.i.pressed = false;
    playerInventory();
}

function playerInventory() {
    const animationId = window.requestAnimationFrame(playerInventory);

    if (keys.i.pressed && playerUI.open === true) {
        window.cancelAnimationFrame(animationId);
        closePlayerInventory();
    }
}

function closePlayerInventory() {
    if (playerUI.open === true) {
        keys.i.pressed = false;
        animate();
        playerUI.open = false;
        document.querySelector("#playerUIContainer").style.display = "none";
        document.querySelector("#pokemonBagView").style.visibility = "hidden";
    }
}

function showPokemonBag() {
    document.querySelector("#pokemonBagView").replaceChildren();
    document.querySelector("#pokemonBagView").style.visibility = "visible";
    let localPokemon = getLocalStoredPokemon();
    for (let i = 0; i < 6; i++) {
        let currentPokemon = localPokemon.get(i);
        if (currentPokemon !== undefined) {
            const button = document.createElement("button");
            button.id = "pokemonBag" + i;
            button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBagView").append(button);
        } else {
            const button = document.createElement("button");
            button.id = "pokemonBag" + i;
            button.disabled = true;
            //button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBagView").append(button);
        }
    }
}
