function itemOnPokemon(pokeIndex, battlePokemon, potionType) {
    let localPoke = getLocalStoredPokemon(),
        playerPokemonDetails = localPoke.get(pokeIndex);

    switch (items[potionType].type) {
        case "heal":
            if (playerPokemonDetails.details.health < playerPokemonDetails.details.maxHealth) {
                let newHealth = playerPokemonDetails.details.health + items[potionType].amount;
                if (newHealth > playerPokemonDetails.details.maxHealth) {
                    newHealth = playerPokemonDetails.details.maxHealth;
                }

                playerPokemonDetails.details.health = newHealth;
                setLocalPokemon(pokeIndex, playerPokemonDetails);
                let currentItems = getItems(),
                    itemDetails = currentItems.get(potionType);
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
    }
}
