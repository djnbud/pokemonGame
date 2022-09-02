const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./assets/battleBackground.png";
const battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage,
});

/*Temporary force specific pokemon */

let enemyPokemon;
let playerPokemon;
let renderedSprites;
let battleAnimationId;
let queue;
let waiting;

function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#inventoryUI").style.visibility = "hidden";
    document.querySelector("#pokeballsUI").style.visibility = "hidden";
    document.querySelector("#enemyHealthBar").style.width = "100%";
    document.querySelector("#playerHealthBar").style.width = "100%";
    waiting = false;
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

    //draggle = new Monster(monsters.Draggle);
    //emby = new Monster(monsters.Emby);
    //renderedSprites = [draggle, emby];
    queue = [];
}

function enemyAttacks() {
    //enemy attacks
    const randomAttack = enemyPokemon.attacks[Math.floor(Math.random() * enemyPokemon.attacks.length)];

    queue.push(() => {
        enemyPokemon.attack({ attack: randomAttack, recipient: playerPokemon, renderedSprites: renderedSprites });
        if (playerPokemon.health <= 0) {
            queue.push(() => {
                playerPokemon.faint();
            });
            endBattle();
        }
    });
}

function prepareBattle() {
    enemyPokemon = null;
    playerPokemon = null;
    //get players first pokemon
    let localPoke = getLocalStoredPokemon(),
        playerPokemonDetails = localPoke.get(0),
        count = 0;
    playerPokemon = new Monster(monsters[playerPokemonDetails.id]);
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
    enemyPokemon = new Monster(monsters.Draggle);

    renderedSprites = [enemyPokemon, playerPokemon];
    animateBattle();
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
