class EvolveSprite extends Sprite {
    constructor({
        image,
        position,
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
        name,
        shiny,
        evolvePosition,
    }) {
        let assetLink = "./assets/pokemons/" + name + "/";
        assetLink += "Enemy";

        if (shiny === true) {
            assetLink += "Shiny";
        }

        assetLink += name + ".png";

        image = { src: "" };
        image.src = assetLink;
        super({
            position,
            image,
            frames,
            sprites,
            animate,
            rotation,
            scale,
            velocity,
            direction,
        });

        this.position = evolvePosition;

        this.image = new Image();
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = (this.image.width / this.frames.max) * scale;
            this.height = this.image.height * scale;
        };

        this.image.src = image.src;

        this.animate = animate;
        this.opacity = 1;

        this.rotation = rotation;
        this.scale = scale;
        this.direction = direction;
    }
}
