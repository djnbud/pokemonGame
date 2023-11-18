function checkEvolution(pokemon) {
    if (evolutions[pokemon.id]) {
        for (const evolutionType in evolutions[pokemon.id]) {
            switch (evolutionType) {
                case "LevelEvolution":
                    return levelEvolutionCHeck(pokemon, evolutions[pokemon.id][evolutionType]);
            }
        }
    }
    return null;
}

function levelEvolutionCHeck(pokemon, levelEvolution) {
    if (pokemon.details.level >= levelEvolution.Level) {
        return levelEvolution.EvolveTo;
    }
    return null;
}

function evolutionAnimate(postEvolution, oncomplete) {
    gsap.to(postEvolution, {
        opacity: 1,
        repeat: 5,
        yoyo: true,
        duration: 0.3,
        onComplete: () => {
            gsap.to(postEvolution, {
                opacity: 1,
                repeat: 5,
                yoyo: true,
                duration: 0.1,
                onComplete: () => {
                    oncomplete && oncomplete();
                },
            });
        },
    });
}

function runEvolution(pokemonName, playerPokemonSpec, currentSelectedPokemonIndex, exp, playerPokemonDetails, checkEvol, evolveSprites, onComplete) {
    document.querySelector("#dialogueBox").innerHTML =
        pokemonName + " is Evolving!";
    waiting = true;

    let newPokemonSpec = monsters[checkEvol];
    playerPokemonSpec.evolve = true;
    newPokemonSpec.evolve = true;
    let preEvolution = new EvolveSprite(playerPokemonSpec);
    evolveSprites.push(preEvolution);
    let postEvolution = new EvolveSprite(newPokemonSpec);
    evolveSprites.push(postEvolution);

    canvas2.removeAttribute("hidden");
    postEvolution.opacity = 0;

    evolutionAnimate(postEvolution, () => {
        waiting = false;
        evolveSprites.splice(0, 1);
        preEvolution = null;
        postEvolution.opacity = 1;
        let prevPokemonId = playerPokemonDetails.id;
        evolutionStatUpdate(
            playerPokemonDetails,
            newPokemonSpec,
            currentSelectedPokemonIndex,
            exp,
            checkEvol,
            () => {
                document.querySelector("#dialogueBox").innerHTML =
                    prevPokemonId + " evolved into " + checkEvol + "!";
                onComplete && onComplete();
            }
        );
    });
}

function evolutionStatUpdate(
    playerPokemonDetails,
    newPokemonSpec,
    currentSelectedPokemonIndex,
    exp,
    checkEvol,
    oncomplete
) {
    let prevPokemonId = playerPokemonDetails.id;
    updateStats(playerPokemonDetails, newPokemonSpec, exp, checkEvol)

    if (playerPokemonDetails.nickname === prevPokemonId) {
        playerPokemonDetails.nickname = checkEvol;
    }
    setLocalPokemon(currentSelectedPokemonIndex, playerPokemonDetails);
    updateSeenCaught(checkEvol);
    oncomplete && oncomplete();
}
