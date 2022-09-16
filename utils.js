function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

function experienceCalculator(playerPokemon, enemyPokemon) {
    let b = enemyPokemon.baseExpYield, //base Experience yield of enmey fainted pokemon
        L = enemyPokemon.level, //level of fainted pokemon
        Lp = playerPokemon.level, // levl of player pokemon
        s = 1; // for potential exp share
    //Main bracket

    let mainBrackCalc = Math.pow((2 * L + 10) / (L + Lp + 10), 2.5);

    return Math.floor(((b * L) / 5) * (1 / s) * mainBrackCalc + 1);
}
