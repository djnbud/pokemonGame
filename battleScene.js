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
let battleAnimationId;
let queue;
let waiting;

function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
    document.querySelector("#pokeballsUI").style.visibility = "hidden";
    document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
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
    document.querySelector("#pokeballsBox").replaceChildren();
    pokeballs.forEach((value, key) => {
        const button = document.createElement("button");
        button.innerHTML = key;
        button.id = "pokeballBtn" + count;
        document.querySelector("#pokeballsBox").append(button);

        addPokeballQuery("#pokeballBtn" + count);

        const pokeballAmount = document.createElement("h1");
        pokeballAmount.innerHTML = value.amount;
        pokeballAmount.id = key;
        document.querySelector("#pokeballsBox").append(pokeballAmount);
        count++;
    });
    const button = document.createElement("button");
    button.innerHTML = "Back";
    button.id = "pokeballsBack";
    document.querySelector("#pokeballsBox").append(button);
    document.querySelector("#pokeballsBack").addEventListener("click", (e) => {
        document.querySelector("#pokeballsUI").style.visibility = "hidden";
        document.querySelector("#inventoryUI").style.visibility = "visible";
    });
}

function pokemonBagInit() {
    let localPoke = getLocalStoredPokemon();
    document.querySelector("#pokemonBattleBag").replaceChildren();

    for (let i = 0; i < 6; i++) {
        let currentPokemon = localPoke.get(i);
        if (currentPokemon !== undefined) {
            const button = document.createElement("button");
            button.id = "pokemonBagBattleBtn" + i;
            if (i === currentSelectedPokemonIndex) {
                button.style.backgroundColor = "green";
            }
            button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBattleBag").append(button);
            addPokemonBattleBagQuery("#" + button.id);
        } else {
            const button = document.createElement("button");
            button.id = "pokemonBagBattleBtn" + i;
            button.disabled = true;
            //button.innerHTML = currentPokemon.id;
            document.querySelector("#pokemonBattleBag").append(button);
        }
    }

    const button = document.createElement("button");
    button.innerHTML = "Back";
    button.id = "pokemonBagBattleBack";
    document.querySelector("#pokemonBattleBag").append(button);
    document.querySelector("#pokemonBagBattleBack").addEventListener("click", (e) => {
        document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
        document.querySelector("#inventoryUI").style.visibility = "visible";
    });
}

function enemyAttacks() {
    //enemy attacks
    const randomAttack = enemyPokemon.attacks[Math.floor(Math.random() * enemyPokemon.attacks.length)];

    queue.push(() => {
        enemyPokemon.attack({ attack: randomAttack, recipient: playerPokemon, renderedSprites: renderedSprites });
        let localPoke = getLocalStoredPokemon(),
            playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex);
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
                endBattle();
            }
        }
    });
}

function prepareBattle(pokeInd) {
    currentSelectedPokemonIndex = pokeInd;
    enemyPokemon = null;
    playerPokemon = null;
    //get players first pokemon
    let localPoke = getLocalStoredPokemon(),
        playerPokemonDetails = localPoke.get(currentSelectedPokemonIndex),
        count = 0;
    if (playerPokemonDetails.details.health > 0) {
        pokeballsInit();
        pokemonBagInit();
        let playerPokemonSpec = monsters[playerPokemonDetails.id];
        playerPokemonSpec.isEnemy = false;
        playerPokemon = new Monster(playerPokemonSpec);
        playerPokemon.health = playerPokemonDetails.details.health;
        gsap.to("#PlayerHealthBar", {
            width: playerPokemon.health + "%",
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
        let enemyPokemonSpec = monsters.Draggle;
        enemyPokemonSpec.isEnemy = true;
        enemyPokemon = new Monster(enemyPokemonSpec);
        document.querySelector("#enemyPokemonName").innerHTML = monsters.Draggle.name;
        document.querySelector("#playerPokemonName").innerHTML = playerPokemonDetails.nickname;
        renderedSprites = [enemyPokemon, playerPokemon];
        animateBattle();
    } else {
        currentSelectedPokemonIndex++;
        prepareBattle(currentSelectedPokemonIndex);
    }
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
}

function endBattle() {
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
                document.querySelector("#attackDamage").innerHTML = "Attack Damage:";
                gsap.to("#overlappingDiv", {
                    opacity: 0,
                });
                enemyPokemon = null;
                playerPokemon = null;
                renderedSprites = [];
                battle.initiated = false;
                audio.battle.stop();
                audio.Map.play();
            },
        });
    });
}

function addAttackQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        playerPokemon.attack({ attack: selectedAttack, recipient: enemyPokemon, renderedSprites: renderedSprites });

        if (enemyPokemon.health <= 0) {
            queue.push(() => {
                enemyPokemon.faint();
            });
            endBattle();
        }

        enemyAttacks();
    });

    document.querySelector(id).addEventListener("mouseenter", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        document.querySelector("#attackType").innerHTML = selectedAttack.type;
        document.querySelector("#attackType").style.color = selectedAttack.color;
        document.querySelector("#attackDamage").innerHTML = "Attack Damage: " + selectedAttack.damage;
    });
}

function addPokeballQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        let pokeballMapp = getPokeballs();
        let curentPokeball = pokeballMapp.get(e.currentTarget.innerHTML);
        if (curentPokeball.amount > 0) {
            const pokeballImage = new Image();
            pokeballImage.src = "./assets/pokeball.png";
            const pokeball = new Sprite({
                position: { x: playerPokemon.position.x, y: playerPokemon.position.y },
                image: pokeballImage,
                scale: 0.2,
            });

            usePokeball(e.currentTarget.innerHTML);
            document.querySelector("#" + e.currentTarget.innerHTML).innerHTML -= 1;
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
                                if (enemyPokemon.catchAttempt()) {
                                    addPokemonToStorage(enemyPokemon, enemyPokemon.name);

                                    document.querySelector("#dialogueBox").innerHTML =
                                        "Congratualtions! You caught a " + enemyPokemon.name + "!";
                                    renderedSprites.pop();

                                    endBattle();
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

function addPokemonBattleBagQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        if (id !== "#pokemonBagBattleBtn" + currentSelectedPokemonIndex) {
            let pokeIndex = parseInt(id.split("#pokemonBagBattleBtn")[1]);
            let localPoke = getLocalStoredPokemon(),
                playerPokemonDetails = localPoke.get(pokeIndex);
            if (playerPokemonDetails.details.health > 0) {
                document.querySelector("#pokemonBagBattleBtn" + currentSelectedPokemonIndex).style.backgroundColor = "";
                currentSelectedPokemonIndex = pokeIndex;
                document.querySelector(id).style.backgroundColor = "green";

                let count = 0;
                let playerPokemonSpec = monsters[playerPokemonDetails.id];
                playerPokemonSpec.isEnemy = false;
                playerPokemon = new Monster(playerPokemonSpec);
                playerPokemon.health = playerPokemonDetails.details.health;
                gsap.to("#PlayerHealthBar", {
                    width: playerPokemon.health + "%",
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
                document.querySelector("#pokemonBagUIBattle").style.visibility = "hidden";
                document.querySelector("#inventoryUI").style.visibility = "hidden";
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
    document.querySelector("#pokeballsUI").style.visibility = "visible";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
});

document.querySelector("#pokemonBag").addEventListener("click", (e) => {
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
        endBattle();
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
