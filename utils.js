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

function statCalculator(pokemon, baseStats) {
  let iv = 1; //individual value need to determine how to calculator
  let ev = 1; //effort value need to determine how to calculator
  let firstHPCalc = 2 * baseStats.maxHealth;
  ev = ev / 4;
  firstHPCalc += iv;
  firstHPCalc += ev;
  firstHPCalc = firstHPCalc * pokemon.level;
  firstHPCalc = firstHPCalc / 100;
  firstHPCalc += pokemon.level + 10;

  //note ev and iv might be stat specific
  let attackStat = otherStatCalculator(pokemon, baseStats.attackStat, ev, iv);
  let defenseStat = otherStatCalculator(pokemon, baseStats.defenseStat, ev, iv);
  let speedStat = otherStatCalculator(pokemon, baseStats.speedStat, ev, iv);

  return {
    newHealth: Math.floor(firstHPCalc),
    newAttack: Math.floor(attackStat),
    newDefense: Math.floor(defenseStat),
    newSpeed: Math.floor(speedStat),
  };
}

function otherStatCalculator(pokemon, statValue, ev, iv) {
  let firstCalc = 2 * statValue;
  ev = ev / 4;
  firstCalc += iv;
  firstCalc += ev;
  firstCalc = firstCalc * pokemon.level;
  firstCalc = firstCalc / 100;
  firstCalc += 5;

  return firstCalc;
}

function catchCalculator(
  ballCatchRate,
  pokemonCatchRate,
  maxHp,
  currentHp,
  pokemonStatus
) {
  let catchAttempt = Math.floor(Math.random() * 255);

  let topValue =
    ((3 * maxHp - 2 * currentHp) * pokemonCatchRate * ballCatchRate) /
    (3 * maxHp);

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
  let finalDamage = {
    damage: 0,
    wasCrit: false,
    hasZeroTypeEffect: false,
    effects: defendingPokemon.effects,
    newEffect: false,
  };

  if (attackingMove.power > 0) {
    finalDamage = damageMove(attackingPokemon, defendingPokemon, attackingMove);
  }
  if (attackingMove.effect && finalDamage.hasZeroTypeEffect === false) {
    let returnedEffects = this.calculateEffectMove(
      defendingPokemon,
      attackingMove
    );

    finalDamage.effects = returnedEffects.effects;
    finalDamage.newEffect = returnedEffects.newEffect;
  }
  //after calculating the damage return and inflict
  return finalDamage;
}

//calculate if the effect of move hit and add
function calculateEffectMove(defendingPokemon, attackingMove) {
  let effects = defendingPokemon.effects,
    newEffect = false;

  let accuracy = Math.floor(Math.random() * 100);

  if (accuracy <= attackEffects[attackingMove.effect].accuracy) {
    if (!effects.has(attackingMove.effect)) {
      effects.set(attackingMove.effect, getEffectProps(attackingMove.effect));
      newEffect = true;
    }
  }

  return { newEffect: newEffect, effects: effects };
}

//calculate total damage a move does
function damageMove(attackingPokemon, defendingPokemon, attackingMove) {
  let returnDamage = {
    damage: 0,
    wasCrit: false,
    hasZeroTypeEffect: false,
    effect: defendingPokemon.effects,
  };

  let level = attackingPokemon.level,
    a = attackingPokemon.attackStat,
    d = defendingPokemon.defenseStat,
    power = attackingMove.power,
    randomAmnt = Math.floor(Math.random() * (100 - 85 + 1) + 85),
    weather = 1, //potentially add in weather
    typeEfectiveness = [],
    critAttempt = Math.floor(Math.random() * 24),
    crit = 1,
    wasCrit = false,
    hasZeroTypeEffect = false;

  for (let i = 0; i < defendingPokemon.types.length; i++) {
    typeEfectiveness.push(
      typeChart[attackingMove.type][defendingPokemon.types[i]]
    );
  }
  STAB = 1;
  if (critAttempt === 1) {
    wasCrit = true;
    crit = 1.5;
  }
  for (let i = 0; i < attackingPokemon.types.length; i++) {
    if (attackingPokemon.types[i] === attackingMove.type) {
      STAB = 1.5;
      break;
    }
  }

  randomAmnt = randomAmnt / 100;

  let part1Calc = (2 * level) / 5;
  part1Calc += 2;
  let attDef = a / d;
  let part2Calc = part1Calc * power * attDef;
  overCalc = part2Calc / 50;
  overCalc += 2;
  overCalc = overCalc * weather;
  overCalc = overCalc * crit;
  overCalc = overCalc * randomAmnt;
  overCalc = overCalc * STAB;

  for (let i = 0; i < typeEfectiveness.length; i++) {
    if (typeEfectiveness[i] === 0) {
      hasZeroTypeEffect = true;
    }
    overCalc = overCalc * typeEfectiveness[i];
  }

  if (hasZeroTypeEffect === false && Math.floor(overCalc) === 0) {
    overCalc = 1;
  }

  return (returnDamage = {
    damage: Math.floor(overCalc),
    wasCrit: wasCrit,
    hasZeroTypeEffect: hasZeroTypeEffect,
    effect: defendingPokemon.effects,
  });
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

function spawnRandomPokemon(boundaryId) {
  let totalSpawnRates = -1;
  let monSpawns = new Map();
  for (let i = 0; i < monsterSpawns[boundaryId].length; i++) {
    monSpawns.set(monsterSpawns[boundaryId][i], {
      minSpawn: totalSpawnRates + 1,
      maxSpawn:
        totalSpawnRates + monsters[monsterSpawns[boundaryId][i]].spawnRate,
    });
    totalSpawnRates += monsters[monsterSpawns[boundaryId][i]].spawnRate;
  }
  chosenPokemon = Math.floor(Math.random() * totalSpawnRates);

  for (let [key, value] of monSpawns.entries()) {
    if (value.minSpawn <= chosenPokemon && value.maxSpawn > chosenPokemon)
      return key;
  }
}

function isPokemonShiny() {
  let isShiny = false,
    randNo = Math.floor(Math.random() * 4096);
  if (randNo === 1) {
    isShiny = true;
  }
  return isShiny;
}
