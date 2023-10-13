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
