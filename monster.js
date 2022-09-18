class Monster extends Sprite {
    constructor({
        position,
        enemyPosition,
        image,
        frames = {
            max: 1,
            hold: 10,
        },
        sprites,
        animate = false,
        rotation = 0,
        scale = 1,
        velocity,
        direction = "DOWN",
        isEnemy = false,
        name,
        attacks,
        runawayChance = 10,
        health,
        maxHealth,
        baseExpYield,
        level,
        levelingType,
        experience,
        catchRate,
        enemyImage
    }) {
        if (isEnemy === true) {
            position = enemyPosition;
            image = enemyImage;
        }

        super({ position, image, frames, sprites, animate, rotation, scale, velocity, direction });
        this.health = health;
        this.maxHealth = maxHealth;
        this.isEnemy = isEnemy;
        this.name = name;
        this.attacks = attacks;
        this.runawayChance = runawayChance;
        this.baseExpYield = baseExpYield;
        this.level = level;
        this.levelingType = levelingType;
        this.experience = experience;
        this.catchRate = catchRate;
    }

    faint() {
        document.querySelector("#dialogueBox").innerHTML = this.name + " fainted";
        gsap.to(this.position, {
            y: this.position.y + 20,
        });

        gsap.to(this, { opacity: 0 });
        audio.victory.play();
    }

    runAwayAttempt() {
        document.querySelector("#dialogueBox").style.display = "block";
        document.querySelector("#dialogueBox").innerHTML = this.name + " are attempting to run away...";

        const runawayCheck = Math.floor(Math.random() * this.runawayChance);
        return runawayCheck > 5;
    }

    attack({ attack, recipient, renderedSprites }) {
        document.querySelector("#dialogueBox").style.display = "block";
        document.querySelector("#dialogueBox").innerHTML = this.name + " used " + attack.name;
        let healthBar = "#EnemyHealthBar";
        const tl = gsap.timeline();
        let movementDistance;
        if (this.isEnemy) {
            healthBar = "#PlayerHealthBar";
        }
        let rotation = 1;
        if (this.isEnemy) {
            rotation = -2.2;
        }
        recipient.health -= attack.damage;
        switch (attack.name) {
            case "Fireball":
                audio.initFireball.play();
                const fireballImage = new Image();
                fireballImage.src = "./assets/fireball.png";
                const fireball = new Sprite({
                    position: { x: this.position.x, y: this.position.y },
                    image: fireballImage,
                    frames: { max: 4, hold: 10 },
                    animate: true,
                    rotation: rotation,
                });
                renderedSprites.splice(1, 0, fireball);
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        renderedSprites.splice(1, 1);
                        //Enemy gets hit
                        audio.fireballHit.play();
                        let healthPercentage = (recipient.health / recipient.maxHealth) * 100;
                        gsap.to(healthBar, {
                            width: healthPercentage + "%",
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        });
                        gsap.to(recipient, { opacity: 0, repeat: 5, yoyo: true, duration: 0.08 });
                    },
                });
                break;
            case "Tackle":
                movementDistance = 20;
                if (this.isEnemy) {
                    movementDistance = -20;
                }
                tl.to(this.position, { x: this.position.x - movementDistance })
                    .to(this.position, {
                        x: this.position.x + movementDistance * 2,
                        duration: 0.1,
                        onComplete: () => {
                            //Enemy gets hit
                            audio.tackleHit.play();
                            let healthPercentage = (recipient.health / recipient.maxHealth) * 100;
                            gsap.to(healthBar, {
                                width: healthPercentage + "%",
                            });
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08,
                            });
                            gsap.to(recipient, { opacity: 0, repeat: 5, yoyo: true, duration: 0.08 });
                        },
                    })
                    .to(this.position, { x: this.position.x });
                break;
        }
    }
}
