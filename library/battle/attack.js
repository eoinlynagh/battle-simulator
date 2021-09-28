import * as AttackHelpers from "./attackHelpers";
import * as StateHelpers from "../copyClasses";
import { characterHasEffect as hasEffect } from "../classes";
import Heap from "heap";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const BinaryHeap = new Heap(function (a, b) {
  return b.priority - a.priority;
});

export function CastSpell(
  character,
  updateCharacter,
  enemies,
  setEnemies,
  allEnemies,
  attackIndex,
  targetIndex,
  reset,
  setEnemyAttacks,
  handleShopModal,
  setLost,
  nextFloor
) {
  if (attackIndex === -1 || targetIndex === -1) {
    AttackPlayerFromStun(
      character,
      enemies,
      setEnemyAttacks,
      updateCharacter,
      setEnemies,
      allEnemies,
      reset,
      handleShopModal,
      setLost
    );
    return;
  }
  // loads attack data from library
  let attack = character.attacks[attackIndex];
  let newEnemies = StateHelpers.makeNewEnemies(enemies);
  let newCharacter = StateHelpers.makeNewCharacter(character);
  const enemy = newEnemies[targetIndex];

  AttackHelpers.Attack(newCharacter, attack, enemy, reset);
  newCharacter.mana -= 1;
  newEnemies[targetIndex] = enemy;
  setEnemies(newEnemies);

  // TODO: Iterate through all enemies and remove them all?
  if (enemy.health <= 0) {
    AttackHelpers.killEnemy(newEnemies, targetIndex, handleShopModal, reset);
  }

  // if there are no more enemies
  if (newEnemies.length === 0) {
    nextFloor(); //update the enemies on the screen
    return;
  }

  updateCharacter(newCharacter); // update the screen
  setEnemies(newEnemies);

  return;
}

function AttackPlayer(
  character,
  enemies,
  setEnemyAttacks,
  handleShopModal,
  reset,
  setLost
) {
  var enemyAttacks = [];
  var reflecting = false;
  if (hasEffect(character, "Reflect")) {
    reflecting = true;
  }

  AttackHelpers.reduceCharacterEffectDurations(character);
  character.refreshMana();

  enemies.forEach(function (enemy, enemyIndex) {
    var attacked = false;

    if (hasEffect(enemy, "Curse")) {
      applyCurseDamage(enemy, enemyIndex);
      if (hasEffect(enemy, "Doomed")) {
        var multiplier = enemy.getEffectDuration("Doomed");
        applyDoomedDamage(enemy, enemyIndex, multiplier);
      }
    }

    if (enemy.health <= 0 || hasEffect(enemy, "Stun")) {
      enemy.animate = "shake";
      return;
    }

    enemy.attacks.forEach(function (attack) {
      BinaryHeap.push(attack);
    });

    while (BinaryHeap.nodes.length > 0) {
      let attack = BinaryHeap.pop();
      if (!attacked && Math.random() <= attack.chance) {
        attacked = true;
        enemy.animate = "wobble";
        if (reflecting) {
          reflectAttack(enemy, attack, enemyIndex);
        } else {
          AttackHelpers.Attack(enemy, attack, character);
          attack.id = enemy.id;
          enemyAttacks.push(attack);
        }
      }
    }
  });
  setEnemyAttacks(enemyAttacks);
  AttackHelpers.reduceEnemiesEffectDurations(enemies);

  function applyCurseDamage(enemy, enemyIndex) {
    let spoofAttack = new StateHelpers.spoofAttack(enemy);
    let curseDamage = enemy.getEffectDuration("Curse");
    enemy.health -= curseDamage;
    if (enemy.health <= 0) {
      spoofAttack.attackMessage = `${enemy.name} dies from their curse!`;
      AttackHelpers.killEnemy(enemies, enemyIndex, handleShopModal, reset);
    } else {
      spoofAttack.attackMessage = `${enemy.name} takes ${curseDamage} from their curse!`;
      enemyAttacks.push(spoofAttack);
    }
  }

  function applyDoomedDamage(enemy, enemyIndex, multiplier) {
    let spoofAttack = new StateHelpers.spoofAttack(enemy);
    let curseDamage = multiplier * enemy.getEffectDuration("Curse");
    enemy.health -= curseDamage;
    if (enemy.health <= 0) {
      spoofAttack.attackMessage = `${enemy.name} was doomed!`;
      AttackHelpers.killEnemy(enemies, enemyIndex, handleShopModal, reset);
    } else {
      spoofAttack.attackMessage = `${enemy.name} is doomed to take ${curseDamage}!`;
      enemyAttacks.push(spoofAttack);
    }
  }

  function reflectAttack(enemy, attack, enemyIndex) {
    AttackHelpers.Attack(enemy, attack, enemy);
    let spoofAttack = new StateHelpers.spoofAttack(enemy);
    if (enemy.health <= 0) {
      spoofAttack.attackMessage =
        attack.name +
        " is reflected back at " +
        enemy.name +
        " and kills them!";
      AttackHelpers.killEnemy(enemies, enemyIndex, handleShopModal, reset);
    } else {
      spoofAttack.attackMessage =
        attack.name + " is reflected back at " + enemy.name;
      enemyAttacks.push(spoofAttack);
    }
  }
}

export function AttackPlayerFromStun(
  character,
  enemies,
  setEnemyAttacks,
  updateCharacter,
  updateEnemies,
  reset,
  handleShopModal,
  setLost
) {
  setEnemyAttacks([]);
  let newEnemies = StateHelpers.makeNewEnemies(enemies);
  let newCharacter = StateHelpers.makeNewCharacter(character);
  let lost = false;
  updateEnemies(newEnemies);
  sleep(200).then(() => {
    AttackPlayer(
      newCharacter,
      newEnemies,
      setEnemyAttacks,
      handleShopModal,
      reset,
      setLost
    );
    updateCharacter(newCharacter);
    updateEnemies(newEnemies);
    if (newEnemies.length === 0 && !lost) {
      handleShopModal();
      nextFloor();
    } else if (newEnemies.length < enemies.length && !lost) {
      handleShopModal();
      reset();
      updateEnemies(newEnemies);
    }
  });
}
