const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./assets/battleBackground.png";
const battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage,
});

/*Temporary force specific pokemon */

let draggle;
let emby;
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

    document.querySelector("#attacksBox").replaceChildren();
    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];
    count = 0;
    emby.attacks.forEach((attack) => {
        const button = document.createElement("button");
        button.id = "pokemonAttackBtn" + count;
        button.innerHTML = attack.name;
        document.querySelector("#attacksBox").append(button);
        addAttackQuery("#pokemonAttackBtn" + count);
        count++;
    });
}

function enemyAttacks() {
    //enemy attacks
    const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
        draggle.attack({ attack: randomAttack, recipient: emby, renderedSprites: renderedSprites });
        if (emby.health <= 0) {
            queue.push(() => {
                emby.faint();
            });
            queue.push(() => {
                //fade back to black
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId);
                        animate();
                        document.querySelector("#userInterface").style.display = "none";
                        gsap.to("#overlappingDiv", {
                            opacity: 0,
                        });
                        battle.initiated = false;
                        audio.battle.stop();
                        audio.Map.play();
                    },
                });
            });
        }
    });
}

function prepareBattle() {
    //get players first pokemon
    let playerPokemonDetails = getLocalStoredPokemon().get(0);
    playerPokemon = new Monster(monsters[playerPokemonDetails.id]);
    //this will be part of picking a random enemy pokemon or at least set it from given pokemon
    let enemyPokemon = animateBattle();
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
}

function addAttackQuery(id) {
    document.querySelector(id).addEventListener("click", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        emby.attack({ attack: selectedAttack, recipient: draggle, renderedSprites: renderedSprites });

        if (draggle.health <= 0) {
            queue.push(() => {
                draggle.faint();
            });
            queue.push(() => {
                //fade back to black
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId);
                        animate();
                        document.querySelector("#userInterface").style.display = "none";
                        gsap.to("#overlappingDiv", {
                            opacity: 0,
                        });
                        battle.initiated = false;
                        audio.battle.stop();
                        audio.Map.play();
                    },
                });
            });
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
                position: { x: emby.position.x, y: emby.position.y },
                image: pokeballImage,
                scale: 0.2,
            });

            usePokeball(e.currentTarget.innerHTML);
            document.querySelector("#" + e.currentTarget.innerHTML).innerHTML -= 1;
            renderedSprites.push(pokeball);
            document.querySelector("#pokeballsUI").style.visibility = "hidden";
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = "You throw a Pokeball at " + draggle.name;
            queue.push(() => {
                gsap.to(pokeball.position, {
                    x: draggle.position.x,
                    y: draggle.position.y,
                    onComplete: () => {
                        waiting = true;
                        draggle.opacity = 0;
                        gsap.to(pokeball, {
                            opacity: 0.2,
                            repeat: 3,
                            yoyo: true,
                            onComplete: () => {
                                waiting = false;
                                if (draggle.catchAttempt()) {
                                    document.querySelector("#dialogueBox").innerHTML =
                                        "Congratualtions! You caught a " + draggle.name + "!";
                                    renderedSprites.pop();

                                    queue.push(() => {
                                        //fade back to black
                                        gsap.to("#overlappingDiv", {
                                            opacity: 1,
                                            onComplete: () => {
                                                draggle.opacity = 1;
                                                cancelAnimationFrame(battleAnimationId);
                                                animate();
                                                document.querySelector("#userInterface").style.display = "none";
                                                gsap.to("#overlappingDiv", {
                                                    opacity: 0,
                                                });
                                                battle.initiated = false;
                                                audio.battle.stop();
                                                audio.Map.play();
                                            },
                                        });
                                    });
                                } else {
                                    document.querySelector("#dialogueBox").innerHTML =
                                        draggle.name + " managed to jump out the pokeball!";
                                    draggle.opacity = 1;
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
    if (emby.runAwayAttempt()) {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = emby.name + " successfully escaped";
        });
        queue.push(() => {
            //fade back to black
            gsap.to("#overlappingDiv", {
                opacity: 1,
                onComplete: () => {
                    cancelAnimationFrame(battleAnimationId);
                    animate();
                    document.querySelector("#userInterface").style.display = "none";
                    gsap.to("#overlappingDiv", {
                        opacity: 0,
                    });
                    battle.initiated = false;
                    audio.battle.stop();
                    audio.Map.play();
                },
            });
        });
    } else {
        queue.push(() => {
            document.querySelector("#dialogueBox").style.display = "block";
            document.querySelector("#dialogueBox").innerHTML = emby.name + " failed to escape";
        });
        queue.push(() => {
            enemyAttacks();
        });
    }
});
