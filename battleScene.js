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

function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#enemyHealthBar").style.width = "100%";
    document.querySelector("#playerHealthBar").style.width = "100%";
    document.querySelector("#attacksBox").replaceChildren();
    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];
    emby.attacks.forEach((attack) => {
        const button = document.createElement("button");
        button.innerHTML = attack.name;
        document.querySelector("#attacksBox").append(button);
    });

    //event listeners for buttons
    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", (e) => {
            if (e.currentTarget.id === "runAway") {
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
                    enemyAttacks();
                }
            } else {
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
            }
        });
        button.addEventListener("mouseenter", (e) => {
            if (!e.currentTarget.id === "runAway") {
                const selectedAttack = attacks[e.currentTarget.innerHTML];
                document.querySelector("#attackType").innerHTML = selectedAttack.type;
                document.querySelector("#attackType").style.color = selectedAttack.color;
            }
        });
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

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
}
//initBattle();
//animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style.display = "none";
    }
});
