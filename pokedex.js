
let previouslySelected;

function openPokedex() {
    document.querySelector("#pokemonList").replaceChildren();
    for (var monster in monsters) {

        //<div id="1" class="pokemon-name">BULBASAUR</div>
        let pokemon = document.createElement("button");
        pokemon.id = monsters[monster]["name"];
        if (pokemonSeenCaught.has(monsters[monster]["name"])) {
            pokemon.innerText = monsters[monster]["noId"] + ". " + monsters[monster]["name"];
        } else {
            pokemon.innerText = monsters[monster]["noId"] + ". ????"
        }
        pokemon.classList.add("pokemonName");
        pokemon.addEventListener("click", updatePokemon);

        pokemon.style.width = "97%";
        document.getElementById("pokemonList").append(pokemon);
    }
    document.getElementById("pokedexPokemonName").innerText = "Emby";
    document.getElementById("pokemonDescription").innerText = monsters["Emby"]["desc"];
    document.getElementById("Emby").style.background = "rgb(211, 47, 47)";
    let img = getPokemonAsset("Emby", false, false, true);
    document.getElementById("pokemonImg").src = img;
    let typesDiv = document.getElementById("pokemonTypes");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }
    let types = monsters["Emby"]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i];
        type.classList.add("typeBox");
        type.classList.add(types[i]); //adds background color and font color
        typesDiv.append(type);
    }
    updatePokedexCaughtSeen("Emby", true);
    previouslySelected = "Emby";
}

function updatePokedexCaughtSeen(id, pokemonSeen) {
    let caught = "????";
    let seen = "????";
    if (pokemonSeen === true) {

        if (pokemonSeenCaught.get(id).caught !== null) {
            caught = pokemonSeenCaught.get(id).caught
        }

        if (pokemonSeenCaught.get(id).seen !== null) {
            seen = pokemonSeenCaught.get(id).seen;
        }
    }
    document.getElementById("seen").innerText = "Seen: " + seen;
    document.getElementById("caught").innerText = "Caught: " + caught;

}


function updatePokemon() {

    document.getElementById(previouslySelected).style.background = "white";
    document.getElementById(this.id).style.background = "rgb(211, 47, 47)";
    previouslySelected = this.id;
    //clear previous type
    let typesDiv = document.getElementById("pokemonTypes");
    while (typesDiv.firstChild) {
        typesDiv.firstChild.remove();
    }
    //update description
    if (pokemonSeenCaught.has(monsters[this.id]["name"])) {
        let img = getPokemonAsset(monsters[this.id]["name"], false, false, true);
        document.getElementById("pokemonImg").src = img;
        document.getElementById("pokedexPokemonName").innerText = this.id;
        document.getElementById("pokemonDescription").innerText = monsters[this.id]["desc"];
        //update types
        let types = monsters[this.id]["types"];
        for (let i = 0; i < types.length; i++) {
            let type = document.createElement("span");
            type.innerText = types[i];
            type.classList.add("typeBox");
            type.classList.add(types[i]); //adds background color and font color
            typesDiv.append(type);
        }
        updatePokedexCaughtSeen(this.id, true);
    } else {
        document.getElementById("pokemonImg").src = "./assets/Question_mark.png";
        document.getElementById("pokedexPokemonName").innerText = "????";
        document.getElementById("pokemonDescription").innerText = "????";
        updatePokedexCaughtSeen(this.id, false);
        let type = document.createElement("span");
        type.innerText = "????";
        type.classList.add("typeBox");
        type.classList.add("Blank"); //adds background color and font color
        typesDiv.append(type);

    }

}
