let evolveSpritesBase = [];
let itemAnimationId;
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
                updateStats(playerPokemonDetails, playerPokemonSpec, 0, playerPokemonDetails.id);
                setLocalPokemon(pokeIndex, playerPokemonDetails);

                //check if pokemon reached to a level stage where it can evolve
                let checkEvol = checkEvolution(playerPokemonDetails);
                if (checkEvol !== null) {
                    animateItem();
                    c2.clearRect(0, 0, canvas.width, canvas.height);
                    c2.fillStyle = "white";
                    c2.fillRect(0, 0, canvas2.width, canvas2.height);
                    document.querySelector("#dialogueBox").style.display = "block";
                    document.querySelector("#dialogueBox").style.visibility = "visible";
                    runEvolution(playerPokemonDetails.nickname, playerPokemonSpec, currentSelectedPokemonIndex, 0, playerPokemonDetails, checkEvol, evolveSpritesBase,
                        () => {
                            queue.push(() => {
                                canvas2.setAttribute("hidden", "hidden");
                                evolveSpritesBase = [];
                                document.querySelector("#dialogueBox").style.visibility = "hidden";
                                cancelAnimationFrame(itemAnimationId);
                            });
                        }
                    );
                }

                itemDetails.amount -= 1;
                setItem(potionType, itemDetails);
            }
            break;
    }

    if (itemDetails.amount === 0) {
        removeItem(potionType);
    }
}

function animateItem() {
    itemAnimationId = window.requestAnimationFrame(animateItem);

    if (evolveSpritesBase !== undefined) {
        evolveSpritesBase.forEach((sprite) => {
            sprite.draw2();
        });
    }
}
