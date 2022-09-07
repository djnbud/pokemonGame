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
let pokemonBagSelected1;
let defaultColour;
function showPokemonBag() {
    pokemonBagSelected1 = null;
    pokemonBagSelected2 = null;
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
            addPokemonSwapQuery("#" + button.id);
            defaultColour = button.style.backgroundColor;
        } else {
            const button = document.createElement("button");
            button.id = "pokemonBag" + i;
            button.disabled = true;
            //button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBagView").append(button);
        }
    }
}

function addPokemonSwapQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        switch (pokemonBagSelected1) {
            case null:
                pokemonBagSelected1 = id;
                document.querySelector(id).style.backgroundColor = "green";
                break;

            case id:
                pokemonBagSelected1 = null;
                document.querySelector(id).style.backgroundColor = defaultColour;
                break;
            default:
                //means a different pokemon is already selected
                let localPokemon = getLocalStoredPokemon();
                let subStr1 = parseInt(pokemonBagSelected1.split("pokemonBag")[1]);
                let subStr2 = parseInt(id.split("pokemonBag")[1]);
                let pokemon1 = localPokemon.get(subStr1);
                let pokemon2 = localPokemon.get(subStr2);

                setLocalPokemon(subStr1, pokemon2);
                setLocalPokemon(subStr2, pokemon1);

                document.querySelector(pokemonBagSelected1).style.backgroundColor = defaultColour;
                showPokemonBag();
                break;
        }
    });
}
