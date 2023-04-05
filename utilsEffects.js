function effectsChecker(pokemon) {
  let canAttack = true,
    removeEffects = [];

  pokemon.effects.forEach(function (effectProps, effectName) {
    if (effectProps.effectCounter || effectProps.effectCounter === 0) {
      let counterEffs = counterEffects(pokemon.name, effectName, effectProps);
      canAttack = counterEffs.canAttack;
      if (counterEffs.removeEff == true) {
        removeEffects.push(effectName);
      }
    }
  });

  if (removeEffects.length > 0) {
    removeEffects.forEach((effectName) => {
      removeEffect(pokemon.name, pokemon.effects, effectName);
    });
  }

  return canAttack;
}

//checks the effects counter that keeps track of how long the effect is set for
//-1 is for unlimited time (or at least until pokemon is healed for it)
function counterEffects(pokemonName, effectName, effectProps) {
  let canAttack = true,
    removeEff = false;
  if (effectProps.effectCounter > 0 || effectProps.effectCounter === -1) {
    canAttack = false;
    effectProps.effectCounter = updateEffectCounter(effectCounter);
  } else {
    removeEff = true;
  }
  return { canAttack: canAttack, removeEffect: removeEff };
}

function removeEffect(pokemonName, effects, effectName) {
  effects.delete(effectName);
  queue.push(() => {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      pokemonName + " is no longer " + attackEffects[effectName].description;
  });
}

function updateEffectCounter(effectCounter) {
  if (effectCounter > 0) {
    effectCounter -= 1;
  }
  return effectCounter;
}

function getEffectProps(effect) {
  let effectCounter = 0;
  if (effect.minCounter && effect.maxCounter) {
    effectCounter = minMaxCounter(effect.minCounter, effect.maxCounter);
  }

  return { effectCounter: effectCounter };
}

function minMaxCounter(minCounter, maxCounter) {
  return Math.floor(Math.random() * (maxCounter - minCounter) + minCounter);
}
