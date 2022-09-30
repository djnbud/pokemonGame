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

function catchCalculator(ballCatchRate, pokemonCatchRate, maxHp, currentHp, pokemonStatus) {
    let catchAttempt = Math.floor(Math.random() * 255);

    let topValue = ((3 * maxHp - 2 * currentHp) * pokemonCatchRate * ballCatchRate) / (3 * maxHp);

    if (topValue < 1) {
        topValue = 1;
    }
    if (pokemonStatus !== undefined) {
        topValue += pokemonStatus;
    }

    if (catchAttempt <= topValue) {
        return true;
    }
    return false;
}

//Gen 5 calculation note that have not include certain calculations for now
function damageCalculator(attackingPokemon, defendingPokemon, attackingMove) {
    let level = attackingPokemon.level,
        a = attackingPokemon.attackStat,
        d = defendingPokemon.defenseStat,
        power = attackingMove.power,
        randomAmnt = Math.floor(Math.random() * (100 - 85 + 1) + 85),
        weather = 1, //potentially add in weather
        typeEfectiveness = typeChart[attackingMove.type][defendingPokemon.type],
        critAttempt = Math.floor(Math.random() * 255),
        crit = 1;
    if (critAttempt < attackingPokemon.speedStat / 2) {
        crit = 1.5;
    }

    randomAmnt = randomAmnt / 100;

    let part1Calc = (2 * level) / 5;
    part1Calc += 2;
    let attDef = a / d;
    let part2Calc = part1Calc * power * attDef;
    let overCalc = part2Calc / 50;
    overCalc += 2;
    overCalc = overCalc * weather;
    overCalc = overCalc * crit;
    overCalc = overCalc * randomAmnt;
    overCalc = overCalc * typeEfectiveness;

    //after calculating the damage return and inflict
    return Math.floor(overCalc);
}

function createBlankSpace(id, appendTo) {
    const button = document.createElement("div");
    button.id = id;
    button.width = "100%";
    button.height = "100%";
    button.animate = false;

    document.querySelector(appendTo).append(button);
}

function createBackButton(id, appendTo, hide, show) {
    const button = document.createElement("button");
    button.innerHTML = "Back";
    button.id = id;
    document.querySelector("#" + appendTo).append(button);
    document.querySelector("#" + id).addEventListener("click", (e) => {
        document.querySelector("#" + hide).style.visibility = "hidden";
        document.querySelector("#" + show).style.visibility = "visible";
    });
}
