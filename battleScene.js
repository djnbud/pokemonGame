const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./assets/battleBackground.png";
const battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage,
});

/*Temporary force specific pokemon */

let enemyPokemon;
let playerPokemon;
let currentSelectedPokemonIndex;
let renderedSprites;
let evolveSprites;
let battleAnimationId;
let queue;
let waiting;
let usingPotion = false;
let currentPotionType;
let localPoke;

function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.visibility = "visible";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
    document.querySelector("#pokeballsUI").style.visibility = "hidden";
    document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
    document.querySelector("#itemsBagUI").style.visibility = "hidden";

    document.querySelector("#enemyHealthBar").style.width = "100%";
    document.querySelector("#playerHealthBar").style.width = "100%";
    waiting = false;

    //draggle = new Monster(monsters.Draggle);
    //emby = new Monster(monsters.Emby);
    //renderedSprites = [draggle, emby];
    queue = [];
}

function pokeballsInit() {
    let pokeballs = getPokeballs();

    let count = 0;
    document.querySelector("#pokeballsBackDiv").replaceChildren();
    document.querySelector("#pokeballsBox").replaceChildren();
    pokeballs.forEach((value, key) => {
        const button = document.createElement("button");
        button.innerHTML = key + " x" + value.amount;
        button.id = key;
        if (count % 2 == 0) {
            button.style.borderBottom = "black solid";
            button.style.borderRight = "black solid";
        } else {
            button.style.borderBottom = "black solid";
        }
        button.style.minHeight = "38px";
        button.style.maxHeight = "38px";
        document.querySelector("#pokeballsBox").append(button);

        addPokeballQuery("#" + key);
        count++;
    });

    if (count < 6) {
        for (let i = 0; i < 6 - count; i++) {
            createBlankSpace("pokeballBlank" + i, "#pokeballsBox");
        }
    } else {
        document.querySelector("#pokeballsBox").overflow = "scroll";
    }

    createBackButton("pokeballsBack", "pokeballsBackDiv", "pokeballsUI", "inventoryUI");
}

function pokemonBagInit() {
    document.querySelector("#pokemonBattleBag").replaceChildren();
    document.querySelector("#pokemonBattleBackDiv").replaceChildren();

    for (let i = 0; i < 6; i++) {
        let currentPokemon = localPoke.get(i);
        if (currentPokemon !== undefined) {
            const button = document.createElement("button");
            button.id = "pokemonBagBattleBtn" + i;
            if (i === currentSelectedPokemonIndex) {
                button.style.backgroundColor = "green";
            }
            if (i % 2 == 0) {
                button.style.borderBottom = "black solid";
                button.style.borderRight = "black solid";
            } else {
                button.style.borderBottom = "black solid";
            }
            button.style.minHeight = "38px";
            button.style.maxHeight = "38px";
            button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBattleBag").append(button);
            addPokemonBattleBagQuery("#" + button.id);
        } else {
            createBlankSpace("pokemonBagBattleBtn" + i, "#pokemonBattleBag");
        }
    }

    createBackButton("pokemonBagBattleBack", "pokemonBattleBackDiv", "pokemonBagUIBattle", "inventoryUI");
    document.querySelector("#pokemonBagBattleBack").addEventListener("click", (e) => {
        usingPotion = false;
    });
}

function itemsBagInit() {
    document.querySelector("#itemsBattleBag").replaceChildren();
    document.querySelector("#itemsBackDiv").replaceChildren();
    let count = 0;
    let playerItems = getItems();
    playerItems.forEach((value, key) => {
        let itemDesc = items[key];
        if (itemDesc.type === "heal") {
            const button = document.createElement("button");
            button.innerHTML = key + " x" + value.amount;
            button.id = key;
            if (count % 2 == 0) {
                button.style.borderBottom = "black solid";
                button.style.borderRight = "black solid";
            } else {
                button.style.borderBottom = "black solid";
            }
            button.style.minHeight = "38px";
            button.style.maxHeight = "38px";
            document.querySelector("#itemsBattleBag").append(button);
            addItemUseQueary("#" + key);
            count++;
        }
    });

    if (count < 6) {
        for (let i = 0; i < 6 - count; i++) {
            createBlankSpace("itemBagBattleBtn" + i, "#itemsBattleBag");
        }
    }

    createBackButton("itemsBagBattleBack", "itemsBackDiv", "itemsBagUI", "inventoryUI");
}

function prepareBattle(pokeInd, enemyPoke) {
    currentSelectedPokemonIndex = pokeInd;
    enemyPokemon = null;
    playerPokemon = null;
    //get players first pokemon
    localPoke = getLocalStoredPokemon();
    let playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex),
        count = 0;
    if (playerPokemonDetails.details.health > 0) {
        let playerPokemonSpec = monsters[playerPokemonDetails.id];
        playerPokemonSpec.isEnemy = false;
        playerPokemonSpec.shiny = playerPokemonDetails.details.shiny;
        playerPokemon = new Monster(playerPokemonSpec);

        playerPokemon.health = playerPokemonDetails.details.health;
        playerPokemon.level = playerPokemonDetails.details.level;
        playerPokemon.attackStat = playerPokemonDetails.details.attackStat;
        playerPokemon.defenseStat = playerPokemonDetails.details.defenseStat;
        playerPokemon.maxHealth = playerPokemonDetails.details.maxHealth;
        playerPokemon.speedStat = playerPokemonDetails.details.speedStat;
        let healthPercentage = (playerPokemon.health / playerPokemon.maxHealth) * 100;
        gsap.to("#PlayerHealthBar", {
            width: healthPercentage + "%",
        });

        let nextLvl = playerPokemon.level + 1;
        let nextLevelNeeded = experienceLevelGrid[nextLvl][playerPokemon.levelingType];
        let expPercentage = (playerPokemonDetails.details.experience / nextLevelNeeded) * 100;
        gsap.to("#PlayerExpBar", {
            width: expPercentage + "%",
        });
        document.querySelector("#attacksBox").replaceChildren();
        playerPokemonDetails.details.attacks.forEach((attack) => {
            const button = document.createElement("button");
            button.id = "pokemonAttackBtn" + count;
            button.innerHTML = attack.name;
            document.querySelector("#attacksBox").append(button);
            addAttackQuery("#pokemonAttackBtn" + count);
            count++;
        });
        //this will be part of picking a random enemy pokemon or at least set it from given pokemon
        let enemyPokemonSpec = monsters[enemyPoke];
        enemyPokemonSpec.isEnemy = true;
        enemyPokemonSpec.shiny = isPokemonShiny();
        //will need to change so first parameter is the randomly generated pokemon with random level
        let updatedStats = statCalculator(enemyPokemonSpec, enemyPokemonSpec);

        enemyPokemon = new Monster(enemyPokemonSpec);
        enemyPokemon.attackStat = updatedStats.newAttack;
        enemyPokemon.defenseStat = updatedStats.newDefense;
        enemyPokemon.maxHealth = updatedStats.newHealth;
        enemyPokemon.health = updatedStats.newHealth;
        enemyPokemon.speedStat = updatedStats.newSpeed;

        let healthEnemyPercentage = (enemyPokemon.health / enemyPokemon.maxHealth) * 100;
        gsap.to("#enemyHealthBar", {
            width: healthEnemyPercentage + "%",
        });

        document.querySelector("#enemyPokemonName").innerHTML = monsters[enemyPoke].name;
        document.querySelector("#enemyPokemonLevel").innerHTML = monsters[enemyPoke].level;
        document.querySelector("#playerPokemonName").innerHTML = playerPokemonDetails.nickname;
        document.querySelector("#playerPokemonLevel").innerHTML = playerPokemonDetails.details.level;
        renderedSprites = [enemyPokemon, playerPokemon];
        evolveSprites = [];
        animateBattle();

        document.querySelector("#dialogueBox").style.display = "block";
        document.querySelector("#dialogueBox").innerHTML = "A wild " + enemyPokemonSpec.name + " appeared!";

    } else {
        currentSelectedPokemonIndex++;
        prepareBattle(currentSelectedPokemonIndex);
    }
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    c2.clearRect(0, 0, canvas.width, canvas.height);
    c2.fillStyle = "white";
    c2.fillRect(0, 0, canvas2.width, canvas2.height);
    battleBackground.draw();
    if (renderedSprites !== undefined) {
        renderedSprites.forEach((sprite) => {
            sprite.draw();
        });
    }
    if (evolveSprites !== undefined) {
        evolveSprites.forEach((sprite) => {
            sprite.draw2();
        });
    }
}

function endBattle(gainExperience) {
    if (gainExperience === true) {
        queue.push(() => {
            experienceGained();
        });
    }
    queue.push(() => {
        //fade back to black
        gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
                enemyPokemon.opacity = 1;
                cancelAnimationFrame(battleAnimationId);

                animate();

                document.querySelector("#userInterface").style.display = "none";
                document.querySelector("#attackType").innerHTML = "Attack Type";
                document.querySelector("#attackType").style.color = "Black";
                document.querySelector("#attackPower").innerHTML = "Attack Power:";
                gsap.to("#overlappingDiv", {
                    opacity: 0,
                });
                enemyPokemon = null;
                playerPokemon = null;
                renderedSprites = [];
                evolveSprites = [];
                canvas2.setAttribute("hidden", "hidden");
                battle.initiated = false;
                document.querySelector("#dialogueBox").style.visibility = "hidden";
                audio.battle.stop();
                audio.Map.play();
            },
        });
    });
}

function increaseExpBar(widthAmount, levelCount, exp, nextLevelNeeded, onCompleted) {
    gsap.to("#PlayerExpBar", {
        width: widthAmount + "%",
        duration: 0.8,
        onComplete: () => {
            if (widthAmount < 100) {
                onCompleted && onCompleted(exp, levelCount);
            } else {
                //update pokemon level here
                gsap.to("#PlayerExpBar", {
                    width: 0 + "%",
                    duration: 0.001,
                    onComplete: () => {
                        document.querySelector("#playerPokemonLevel").innerHTML = playerPokemon.level + levelCount;

                        levelCount++;
                        exp -= nextLevelNeeded;
                        let playerNextLevel = playerPokemon.level + levelCount;
                        nextLevelNeeded = experienceLevelGrid[playerNextLevel][playerPokemon.levelingType];
                        let nextExpPercentage = (exp / nextLevelNeeded) * 100;
                        if (nextExpPercentage > 100) {
                            increaseExpBar(100, levelCount, exp, nextLevelNeeded, onCompleted);
                        } else {
                            increaseExpBar(nextExpPercentage, levelCount, exp, nextLevelNeeded, onCompleted);
                        }
                    },
                });
            }
        },
    });
}

function finishExpGain(exp, levelCount) {
    let newLevel = playerPokemon.level + (levelCount - 1);
    waiting = false;
    if (newLevel > playerPokemon.level) {
        document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " reached level " + newLevel;
    }
    let playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex);

    playerPokemonDetails.details.level = newLevel;
    let playerPokemonSpec = monsters[playerPokemonDetails.id];
    playerPokemonSpec.shiny = playerPokemonDetails.details.shiny;
    let updatedPlayerPokemonStats = statCalculator(playerPokemonDetails.details, playerPokemonSpec);

    playerPokemonDetails.details.maxHealth = updatedPlayerPokemonStats.newHealth;
    playerPokemonDetails.details.attackStat = updatedPlayerPokemonStats.newAttack;
    playerPokemonDetails.details.defenseStat = updatedPlayerPokemonStats.newDefense;
    playerPokemonDetails.details.speedStat = updatedPlayerPokemonStats.newSpeed;
    playerPokemonDetails.details.experience = exp;

    setLocalPokemon(currentSelectedPokemonIndex, playerPokemonDetails);

    //check if pokemon reached to a level stage where it can evolve
    let checkEvol = checkEvolution(localPoke.get(currentSelectedPokemonIndex));
    if (checkEvol !== null) {
        document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " is Evolving!";
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
                }
            );
        });
    }
}

function experienceGained() {
    let playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex);
    let newExp = experienceCalculator(playerPokemon, enemyPokemon),
        exp = newExp + playerPokemonDetails.details.experience;
    document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " gained " + newExp + " experience!";
    let nextLvl = playerPokemon.level + 1;
    let nextLevelNeeded = experienceLevelGrid[nextLvl][playerPokemon.levelingType];
    let expPercentage = (exp / nextLevelNeeded) * 100;
    //if more than 100% reached then need to loop until they go up x amount of levels
    if (expPercentage > 100) {
        waiting = true;
        let levelCount = 1,
            playerNextLevel = playerPokemon.level + levelCount,
            nextExpPercentage = (exp / nextLevelNeeded) * 100;

        increaseExpBar(100, levelCount, exp, playerNextLevel, finishExpGain);
    } else {
        if (expPercentage === 100) {
            gsap.to("#PlayerExpBar", {
                width: 100 + "%",
                onComplete: () => {
                    document.querySelector("#PlayerExpBar").width = 0 + "%";
                    //update pokemon level here
                    document.querySelector("#playerPokemonLevel").innerHTML = playerPokemon.level + 1;
                    finishExpGain(exp, 2);
                },
            });
        } else {
            gsap.to("#PlayerExpBar", {
                width: expPercentage + "%",
            });
            finishExpGain(exp, 1);
        }
    }
}

function addAttackQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        let playerFirst = true;
        if (enemyPokemon.speedStat === playerPokemon.speedStat) {
            let pickedPokemon = Math.round(Math.random());
            if (pickedPokemon === 1) {
                playerFirst = false
            }
        } else {
            if (enemyPokemon.speedStat > playerPokemon.speedStat) {
                playerFirst = false
            }
        }

        if (playerFirst === true) {
            playerAttack(selectedAttack);
            queue.push(() => {
                enemyAttacks();
            });
        } else {
            enemyAttacks();
            queue.push(() => {
                playerAttack(selectedAttack);
            });
        }
    });

    document.querySelector(id).addEventListener("mouseenter", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        document.querySelector("#attackType").innerHTML = selectedAttack.type;
        document.querySelector("#attackType").style.color = selectedAttack.color;
        document.querySelector("#attackPower").innerHTML = "Attack Power: " + selectedAttack.power;
    });
}

function enemyAttacks() {
    //enemy attacks
    const randomAttack = enemyPokemon.attacks[Math.floor(Math.random() * enemyPokemon.attacks.length)];

    let damageDetails = enemyPokemon.attack({
        attack: randomAttack,
        recipient: playerPokemon,
        renderedSprites: renderedSprites,
    });
    if (damageDetails.wasCrit === true) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = "It was a Critical Hit!";
        });
    }
    if (damageDetails.hasZeroTypeEffect === true) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = enemyPokemon.name + " Missed!";
        });
    }
    let playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex);
    if (playerPokemon.health <= 0) {
        playerPokemonDetails.details.health = 0;
    } else {
        playerPokemonDetails.details.health = playerPokemon.health;
    }
    setLocalPokemon(currentSelectedPokemonIndex, playerPokemonDetails);
    if (playerPokemon.health <= 0) {
        queue.push(() => {
            playerPokemon.faint();
        });

        //if true then player has at least one pokemon with health > 0

        if (checkAllLocalPokemonHealth()) {
            //NEED TO MAKE IT SO PLAYER CAN SWITCH POKEMON BY ADDING BAG OPTION SO THIS POINT DISPLAY POKEMON BAG!
            //MAKE SURE TO REMOVE END BATTLE FROM HERE TOO
            document.querySelector("#pokemonBagUIBattle").style.visibility = "visible";

            document.querySelector("#pokemonBagBattleBack").disabled = true;
        } else {
            //send player back to starting position or eventually last visited pokecentre with pokemon healed
            movables.forEach((movable) => {
                movable.position.x -= distanceTravelled.x;
                movable.position.y -= distanceTravelled.y;
            });
            distanceTravelled.x = 0;
            distanceTravelled.y = 0;
            queue.push(() => {
                document.querySelector("#dialogueBox").innerHTML = "You have no Pokemon Left and have had to flee!";
            });
            healAllLocalPokemon();
            endBattle(false);
        }
    }
}

function playerAttack(selectedAttack) {
    let damageDetails = playerPokemon.attack({
        attack: selectedAttack,
        recipient: enemyPokemon,
        renderedSprites: renderedSprites,
    });

    if (damageDetails.wasCrit === true) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = "It was a Critical Hit!";
        });
    }

    if (damageDetails.hasZeroTypeEffect === true) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " Missed!";
        });
    }

    if (enemyPokemon.health <= 0) {
        queue.push(() => {
            enemyPokemon.faint();
        });

        endBattle(true);
    }
}

function addPokeballQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        let pokeballMapp = getPokeballs(),
            curentPokeball = pokeballMapp.get(e.currentTarget.id),
            pokeballDesc = pokeballs[e.currentTarget.id];
        if (curentPokeball.amount > 0) {
            const pokeballImage = new Image();
            pokeballImage.src = "./assets/pokeball.png";
            const pokeball = new Sprite({
                position: { x: playerPokemon.position.x, y: playerPokemon.position.y },
                image: pokeballImage,
                scale: 0.2,
            });

            usePokeball(e.currentTarget.id);
            document.querySelector("#" + e.currentTarget.id).innerHTML =
                e.currentTarget.id + " x" + curentPokeball.amount;
            renderedSprites.push(pokeball);
            document.querySelector("#pokeballsUI").style.visibility = "hidden";
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = "You throw a Pokeball at " + enemyPokemon.name;
            queue.push(() => {
                gsap.to(pokeball.position, {
                    x: enemyPokemon.position.x,
                    y: enemyPokemon.position.y,
                    onComplete: () => {
                        waiting = true;
                        enemyPokemon.opacity = 0;
                        gsap.to(pokeball, {
                            opacity: 0.2,
                            repeat: 3,
                            yoyo: true,
                            onComplete: () => {
                                waiting = false;
                                if (
                                    catchCalculator(
                                        pokeballDesc.catchRate,
                                        enemyPokemon.catchRate,
                                        enemyPokemon.maxHealth,
                                        enemyPokemon.health,
                                        enemyPokemon.status
                                    )
                                ) {
                                    addPokemonToStorage(enemyPokemon, enemyPokemon.name);

                                    document.querySelector("#dialogueBox").innerHTML =
                                        "Congratualtions! You caught a " + enemyPokemon.name + "!";
                                    renderedSprites.pop();

                                    endBattle(true);
                                } else {
                                    document.querySelector("#dialogueBox").innerHTML =
                                        enemyPokemon.name + " managed to jump out the pokeball!";
                                    enemyPokemon.opacity = 1;
                                    renderedSprites.pop();
                                    enemyAttacks();
                                }
                            },
                        });
                    },
                });
            });
        }
    });
}

function addItemUseQueary(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        usingPotion = true;
        currentPotionType = e.currentTarget.id;
        pokemonBagInit();
        document.querySelector("#itemsBagUI").style.visibility = "hidden";
        document.querySelector("#pokemonBagUIBattle").style.visibility = "visible";
    });
}

function addPokemonBattleBagQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        if (usingPotion === true) {
            let pokeIndex = parseInt(id.split("#pokemonBagBattleBtn")[1]);
            //check if potion will actually do anything
            itemOnPokemon(pokeIndex, playerPokemon, currentPotionType);
        } else {
            if (id !== "#pokemonBagBattleBtn" + currentSelectedPokemonIndex) {
                let pokeIndex = parseInt(id.split("#pokemonBagBattleBtn")[1]);
                let playerPokemonDetails = localPoke.get(pokeIndex);
                if (playerPokemonDetails.details.health > 0) {
                    document.querySelector("#pokemonBagBattleBtn" + currentSelectedPokemonIndex).style.backgroundColor =
                        "";
                    currentSelectedPokemonIndex = pokeIndex;
                    document.querySelector(id).style.backgroundColor = "green";

                    let count = 0;
                    let playerPokemonSpec = monsters[playerPokemonDetails.id];
                    playerPokemonSpec.isEnemy = false;
                    playerPokemon = new Monster(playerPokemonSpec);
                    playerPokemon.health = playerPokemonDetails.details.health;
                    playerPokemon.level = playerPokemonDetails.details.level;
                    let healthPercentage = (playerPokemon.health / playerPokemon.maxHealth) * 100;
                    gsap.to("#PlayerHealthBar", {
                        width: healthPercentage + "%",
                    });
                    let nextLvl = playerPokemon.level + 1;
                    let nextLevelNeeded = experienceLevelGrid[nextLvl][playerPokemon.levelingType];
                    let expPercentage = (playerPokemonDetails.details.experience / nextLevelNeeded) * 100;
                    gsap.to("#PlayerExpBar", {
                        width: expPercentage + "%",
                    });
                    document.querySelector("#attacksBox").replaceChildren();
                    playerPokemonDetails.details.attacks.forEach((attack) => {
                        const button = document.createElement("button");
                        button.id = "pokemonAttackBtn" + count;
                        button.innerHTML = attack.name;
                        document.querySelector("#attacksBox").append(button);
                        addAttackQuery("#pokemonAttackBtn" + count);
                        count++;
                    });
                    renderedSprites[1] = playerPokemon;
                    document.querySelector("#playerPokemonName").innerHTML = playerPokemonDetails.nickname;
                    document.querySelector("#playerPokemonLevel").innerHTML = playerPokemonDetails.details.level;

                    document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
                    document.querySelector("#inventoryUI").style.visibility = "hidden";
                }
            }
        }
    });
}

//initBattle();
//animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
    if (waiting === false) {
        if (queue.length > 0) {
            queue[0]();
            queue.shift();
        } else {
            e.currentTarget.style.display = "none";
        }
    }
});

document.querySelector("#inventory").addEventListener("click", (e) => {
    //document.querySelector("#firstUI").style.display = "none";
    document.querySelector("#inventoryUI").style.visibility = "visible";
});

document.querySelector("#backInv").addEventListener("click", (e) => {
    //document.querySelector("#firstUI").style.display = "block";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
});

document.querySelector("#pokeballs").addEventListener("click", (e) => {
    pokeballsInit();
    document.querySelector("#pokeballsUI").style.visibility = "visible";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
});

document.querySelector("#potions").addEventListener("click", (e) => {
    itemsBagInit();
    document.querySelector("#itemsBagUI").style.visibility = "visible";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
});

document.querySelector("#pokemonBag").addEventListener("click", (e) => {
    pokemonBagInit();
    document.querySelector("#pokemonBagUIBattle").style.visibility = "visible";
    document.querySelector("#pokemonBagBattleBack").disabled = false;
    document.querySelector("#inventoryUI").style.visibility = "hidden";
});

document.querySelector("#runAway").addEventListener("click", (e) => {
    if (playerPokemon.runAwayAttempt()) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " successfully escaped";
        });
        endBattle(false);
    } else {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = playerPokemon.name + " failed to escape";
        });
        queue.push(() => {
            enemyAttacks();
        });
    }
});
