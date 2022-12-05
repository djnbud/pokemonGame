function checkEvolution(pokemon) {
    if (evolutions[pokemon.id]) {
        for (const evolutionType in evolutions[pokemon.id]) {
            switch (evolutionType) {
                case "LevelEvolution":
                    return levelEvolutionCHeck(pokemon, evolutions[pokemon.id][evolutionType]);
            }
        }
    }
    return null
}

function levelEvolutionCHeck(pokemon, levelEvolution) {
    if (pokemon.details.level >= levelEvolution.Level) {
        return levelEvolution.EvolveTo;
    }
    return null;
}
