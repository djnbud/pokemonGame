function itemOnPokemon(pokeIndex, battlePokemon, potionType) {
    let localPoke = getLocalStoredPokemon(),
        playerPokemonDetails = localPoke.get(pokeIndex),
        currentItems = getItems(),
        itemDetails = currentItems.get(potionType);

    switch (items[potionType].type) {
        case "heal":
            if (playerPokemonDetails.details.health < playerPokemonDetails.details.maxHealth) {
                let newHealth = playerPokemonDetails.details.health + items[potionType].amount;
                if (newHealth > playerPokemonDetails.details.maxHealth) {
                    newHealth = playerPokemonDetails.details.maxHealth;
                }

                playerPokemonDetails.details.health = newHealth;
                setLocalPokemon(pokeIndex, playerPokemonDetails);
                itemDetails.amount -= 1;

                setItem(potionType, itemDetails);
                if (battlePokemon) {
                    battlePokemon.health = newHealth;
                    let healthPercentage = (battlePokemon.health / battlePokemon.maxHealth) * 100;
                    gsap.to("#PlayerHealthBar", {
                        width: healthPercentage + "%",
                    });

                    document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
                    document.querySelector("#inventoryUI").style.visibility = "hidden";
                }
            }
            break;
        case "levelUp":
            if (playerPokemonDetails.details.level < 100 && !battlePokemon) {
                playerPokemonDetails.details.level += 1;
                let playerPokemonSpec = monsters[playerPokemonDetails.id];
                playerPokemonSpec.shiny = playerPokemonDetails.details.shiny;
                updateStats(playerPokemonDetails, playerPokemonSpec, 0, playerPokemonDetails.details.id);
                setLocalPokemon(pokeIndex, playerPokemonDetails);

                itemDetails.amount -= 1;
                setItem(potionType, itemDetails);
            }
            break;
    }

    if (itemDetails.amount === 0) {
        removeItem(potionType);
    }
}
