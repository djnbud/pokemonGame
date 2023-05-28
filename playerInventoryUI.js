function initPlayerInv() {
    document.querySelector("#pokemonPlayerInv").addEventListener("click", (e) => {
        showPokemonBag();
    });
    document.querySelector("#pokemonStoragePlayerInv").addEventListener("click", (e) => { });

    document.querySelector("#pokedexPlayerInv").addEventListener("click", (e) => {
        showPokedex();
    });
    document.querySelector("#itemsPlayerInv").addEventListener("click", (e) => {
        showItemBag();
    });
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
        document.querySelector("#pokemonBagView").style.display = "none"
        document.querySelector("#pokedex").style.visibility = "hidden";
        document.querySelector("#pokedex").style.display = "none"
    }
}

function showPokedex() {
    document.querySelector("#pokemonBagView").replaceChildren();
    document.querySelector("#pokemonBagView").style.visibility = "hidden";
    document.querySelector("#pokemonBagView").style.display = "none"
    document.querySelector("#pokedex").style.visibility = "visible";
    document.querySelector("#pokedex").style.display = "flex";

    openPokedex();
}

function showItemBag() {
    document.querySelector("#pokedex").style.visibility = "hidden";
    document.querySelector("#pokedex").style.display = "none"
    document.querySelector("#pokemonBagView").replaceChildren();
    document.querySelector("#pokemonBagView").style.visibility = "visible";
    document.querySelector("#pokemonBagView").style.display = "grid";

    let playerPokeballs = getPokeballs();

    let playerItems = getItems(),
        count = 0;

    playerPokeballs.forEach((value, key) => {
        const button = document.createElement("button");
        button.innerHTML = key + " x" + value.amount;
        button.id = "Items" + key;
        button.className = "pokemonName";
        document.querySelector("#pokemonBagView").append(button);
        count++;
    })

    playerItems.forEach((value, key) => {
        const button = document.createElement("button");
        button.innerHTML = key + " x" + value.amount;
        button.id = "Items" + key;
        button.className = "pokemonName";
        document.querySelector("#pokemonBagView").append(button);
        count++;

    });

    if (count < 6) {
        for (let i = 0; i < 6 - count; i++) {
            createBlankSpace("itemBag" + i, "#pokemonBagView")
        }
    }
}

let pokemonBagSelected1;
function showPokemonBag() {
    pokemonBagSelected1 = null;
    pokemonBagSelected2 = null;
    document.querySelector("#pokedex").style.visibility = "hidden";
    document.querySelector("#pokedex").style.display = "none"
    document.querySelector("#pokemonBagView").style.display = "grid";
    document.querySelector("#pokemonBagView").replaceChildren();
    document.querySelector("#pokemonBagView").style.visibility = "visible";
    let localPokemon = getLocalStoredPokemon();
    for (let i = 0; i < 6; i++) {
        let currentPokemon = localPokemon.get(i);
        if (currentPokemon !== undefined) {

            /*const pokeBagDetailsContainer = document.createElement("div");
            pokeBagDetailsContainer.id = "pokeBagDetailsContainer" + i;
            document.querySelector("#pokemonBagView").append(pokeBagDetailsContainer);*/

            const button = document.createElement("button");
            button.id = "pokemonBag" + i;
            button.className = "pokemonName";
            //button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBagView").append(button);

            const pokemonImg = document.createElement("img");
            pokemonImg.id = "pokemonBagImg" + i;
            let assetLink = getPokemonAsset(currentPokemon.id, false, currentPokemon.details.shiny, true)
            pokemonImg.src = assetLink;
            pokemonImg.style.width = 100;
            pokemonImg.style.float = "left";
            document.querySelector("#pokemonBag" + i).append(pokemonImg);

            var pokeName = document.createElement("div");
            pokeName.id = "pokemonType" + i;
            pokeName.className = "pokemonDescription";
            let str = "Name: " + currentPokemon.nickname + "\n Types: " + monsters[currentPokemon.id].types + "\n Level: " + currentPokemon.details.level;
            pokeName.innerText = str;
            button.appendChild(pokeName);
            addPokemonSwapQuery("#" + button.id);

        } else {
            createBlankSpace("pokeBagDetailsContainer" + i, "#pokemonBagView");
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
                document.querySelector(id).style.backgroundColor = "";
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

                document.querySelector(pokemonBagSelected1).style.backgroundColor = "";
                showPokemonBag();
                break;
        }
    });
}
