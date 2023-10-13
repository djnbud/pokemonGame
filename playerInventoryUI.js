let previouslySelectedUi = "pokemonPlayerInv";
let usingItem = false;

function initPlayerInv() {
    document.querySelector("#pokemonPlayerInv").addEventListener("click", (e) => {
        showPokemonBag();
        setButtonStyle("pokemonPlayerInv");
    });
    document.querySelector("#pokemonStoragePlayerInv").addEventListener("click", (e) => {
        setButtonStyle("pokemonStoragePlayerInv");
    });

    document.querySelector("#pokedexPlayerInv").addEventListener("click", (e) => {
        showPokedex();
        setButtonStyle("pokedexPlayerInv");
    });
    document.querySelector("#itemsPlayerInv").addEventListener("click", (e) => {
        showItemBag();
        setButtonStyle("itemsPlayerInv");
    });
    document.querySelector("#closePlayerInv").addEventListener("click", (e) => {
        closePlayerInventory();
        setButtonStyle("closePlayerInv");
    });
    keys.i.pressed = false;
    playerInventory();
    showPokemonBag();
    setButtonStyle("pokemonPlayerInv");
}

function playerInventory() {
    const animationId = window.requestAnimationFrame(playerInventory);

    if (keys.i.pressed && playerUI.open === true) {
        window.cancelAnimationFrame(animationId);
        closePlayerInventory();
    }
}

function setButtonStyle(id) {
    document.getElementById(previouslySelectedUi).style.background = "white";
    document.getElementById(id).style.background = "rgb(211, 47, 47)";
    previouslySelectedUi = id;
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
        addItemUseQuery("#" + button.id);
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
            button.appendChild(pokemonImg);

            var pokeGridText = document.createElement("div");
            pokeGridText.id = "pokeGridText" + i;
            pokeGridText.className = "invGridFit";

            popGridCell(pokeGridText, "pokeNameText" + i, "pokemonInvDescription", "Name:")

            popGridCell(pokeGridText, "pokeNameValue" + i, "pokemonInvDescription", currentPokemon.nickname)

            popGridCell(pokeGridText, "pokeAttackText" + i, "pokemonInvDescription", "Attack:")

            popGridCell(pokeGridText, "pokeAttackValue" + i, "pokemonInvDescription", currentPokemon.details.attackStat)

            popGridCell(pokeGridText, "pokeTypesText" + i, "pokemonInvDescription", "Types:")

            popGridCell(pokeGridText, "pokeTypesValue" + i, "pokemonInvDescription", monsters[currentPokemon.id].types)

            popGridCell(pokeGridText, "pokeDefenseText" + i, "pokemonInvDescription", "Defense:")

            popGridCell(pokeGridText, "pokeDefenseValue" + i, "pokemonInvDescription", currentPokemon.details.defenseStat)

            popGridCell(pokeGridText, "pokeLevelText" + i, "pokemonInvDescription", "Level:")

            popGridCell(pokeGridText, "pokeLevelText" + i, "pokemonInvDescription", currentPokemon.details.level)

            popGridCell(pokeGridText, "pokeSpeedText" + i, "pokemonInvDescription", "Speed:")

            popGridCell(pokeGridText, "pokeSpeedValue" + i, "pokemonInvDescription", currentPokemon.details.speedStat)

            hpExpBars(pokeGridText, i);

            button.appendChild(pokeGridText);

            let healthPercentage = (currentPokemon.details.health / currentPokemon.details.maxHealth) * 100;

            document.getElementById("pokemonHpContainer" + i).style.width = 80 + "%";
            document.getElementById("pokemonHp" + i).style.width = healthPercentage + "%";
            let nextLvl = currentPokemon.details.level + 1;
            let nextLevelNeeded = experienceLevelGrid[nextLvl][monsters[currentPokemon.id].levelingType];
            let expPercentage = (currentPokemon.details.experience / nextLevelNeeded) * 100;

            document.getElementById("pokemonExpContainer" + i).style.width = 80 + "%";
            document.getElementById("pokemonExp" + i).style.width = expPercentage + "%";
            if (!usingItem) {
                addPokemonSwapQuery("#" + button.id);
            } else {
                addPokemonItemQuery("#" + button.id);
            }

        } else {
            createBlankSpace("pokeBagDetailsContainer" + i, "#pokemonBagView");
        }
    }
}
//populate grid cell
function popGridCell(grid, name, classN, value) {
    var gridCell = document.createElement("div");
    gridCell.id = name;
    gridCell.className = classN
    gridCell.innerHTML = value
    grid.appendChild(gridCell);
    resize_to_fit(11, gridCell, 13, 8);
}

function hpExpBars(pokeGridText, index) {
    //hp
    popGridCell(pokeGridText, "pokeHpText" + index, "pokemonInvDescription", "HP:")

    var pokeHpGridFit = document.createElement("div");
    pokeHpGridFit.id = "pokemonHpGridFit" + index;
    pokeHpGridFit.className = "hpGridFitInv";

    var pokeHpContainer = document.createElement("div");
    pokeHpContainer.id = "pokemonHpContainer" + index;
    pokeHpContainer.className = "hpContainer";

    var pokeHpBg = document.createElement("div");
    pokeHpBg.id = "pokemonHpBg" + index;
    pokeHpBg.className = "hpBarBg";

    var pokeHp = document.createElement("div");
    pokeHp.id = "pokemonHp" + index;
    pokeHp.className = "hpBar";


    pokeHpContainer.appendChild(pokeHpBg);
    pokeHpContainer.appendChild(pokeHp);

    pokeHpGridFit.appendChild(pokeHpContainer);

    pokeGridText.appendChild(pokeHpGridFit);

    //exp
    popGridCell(pokeGridText, "pokeExpText" + index, "pokemonInvDescription", "EXP:")

    var pokeExpGridFit = document.createElement("div");
    pokeExpGridFit.id = "pokemonExpGridFit" + index;
    pokeExpGridFit.className = "hpGridFitInv";

    var pokeExpContainer = document.createElement("div");
    pokeExpContainer.id = "pokemonExpContainer" + index;
    pokeExpContainer.className = "hpContainer";

    var pokeExpBg = document.createElement("div");
    pokeExpBg.id = "pokemonExpBg" + index;
    pokeExpBg.className = "hpBarBg";

    var pokeExp = document.createElement("div");
    pokeExp.id = "pokemonExp" + index;
    pokeExp.className = "xpBar";


    pokeExpContainer.appendChild(pokeExpBg);
    pokeExpContainer.appendChild(pokeExp);

    pokeExpGridFit.appendChild(pokeExpContainer);

    pokeGridText.appendChild(pokeExpGridFit);


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

function addItemUseQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        currentPotionType = id;
        usingItem = true;
        showPokemonBag();
    })
}

function addPokemonItemQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        let pokeIndex = parseInt(id.split("#pokemonBag")[1]);

        let splitPotionType = currentPotionType.split("#Items")[1];
        //check if potion will actually do anything
        itemOnPokemon(pokeIndex, null, splitPotionType);
        showItemBag();
    });
}
