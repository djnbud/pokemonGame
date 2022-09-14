function animate() {
    const animationId = window.requestAnimationFrame(animate);
    renderables.forEach((renderable) => {
        renderable.draw();
    });

    battleZones.forEach((battleZone) => {
        battleZone.draw();
    });
    let moving = true;
    player.animate = false;

    if (battle.initiated || playerUI.open) return;

    if (keys.i.pressed) {
        playerUI.open = true;
        window.cancelAnimationFrame(animationId);
        document.querySelector("#playerUIContainer").style.display = "block";
        initPlayerInv();
    }

    //check for collision with a battleZone and activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea =
                (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                    Math.max(player.position.y, battleZone.position.y));
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone,
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01 // 0.1 would be 10% of the time sooo we set to lower number to make happen less often
            ) {
                console.log("BATTLE!");
                //deactivate current animation loop
                window.cancelAnimationFrame(animationId);
                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                //activate a new animation loop
                                initBattle();
                                prepareBattle(0);
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                    duration: 0.4,
                                });
                            },
                        });
                    },
                });
                break;
            }
        }
    }

    //check for boundary collisions
    if (keys.w.pressed && lastKey === "w") {
        player.direction = "UP";
        player.animate = true;
        player.image = player.sprites.up;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            });
            distanceTravelled.y += 3;
        }
    } else if (keys.a.pressed && lastKey === "a") {
        player.direction = "LEFT";
        player.animate = true;
        player.image = player.sprites.left;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3;
            });
            distanceTravelled.x += 3;
        }
    } else if (keys.s.pressed && lastKey === "s") {
        player.direction = "DOWN";
        player.animate = true;
        player.image = player.sprites.down;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3;
            });
            distanceTravelled.y -= 3;
        }
    } else if (keys.d.pressed && lastKey === "d") {
        player.direction = "RIGHT";
        player.animate = true;
        player.image = player.sprites.right;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3;
            });
            distanceTravelled.x -= 3;
        }
    } else if (
        keys.w.pressed === false &&
        keys.a.pressed === false &&
        keys.s.pressed === false &&
        keys.d.pressed === false
    ) {
        moving = false;
        if (player.direction === "RIGHT") {
            player.frames.val = 3;
        } else {
            player.frames.val = 0;
        }
    }
}
