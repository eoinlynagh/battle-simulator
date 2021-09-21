import * as AttackData from "../generation/attackMaker";
import Heap from "heap";
import * as AttackHelpers from "./attackHelpers";
import * as StateHelpers from "../generation/createNewStateObjects";

export function AttackEnemy(
  character,
  updateCharacter,
  attack,
  target,
  enemies,
  updateEnemies,
  allEnemies,
  floor,
  updateFloor,
  reset,
  setEnemyAttacks
) {
  attack = AttackData[[attack]];

  let newEnemies = StateHelpers.makeNewEnemies(enemies);
  let newCharacter = StateHelpers.makeNewCharacter(character);
  const enemy = newEnemies.find(({ id }) => id === target);
  const enemyIndex = newEnemies.findIndex(({ id }) => id === target);
  if (newCharacter.mana === newCharacter.maxMana) {
    AttackHelpers.reduceEnemiesEffectDurations(enemies);
    AttackHelpers.reduceCharacterEffectDurations(newCharacter);
  }

  AttackHelpers.Attack(newCharacter, attack, enemy, reset);
  newEnemies[enemyIndex] = enemy;

  if (enemy.health <= 0) {
    newEnemies.splice(enemyIndex, 1);
    reset();
  }
  if (newEnemies.length === 0) {
    newEnemies = nextFloor();
  } else if (character.mana === 1) {
    AttackPlayer(newCharacter, newEnemies, setEnemyAttacks);
  }
  updateCharacter(newCharacter);
  updateEnemies(newEnemies);

  function nextFloor() {
    floor = floor + 1;
    if (floor >= allEnemies.length) {
      reset();
    } else {
      var newCharacter = StateHelpers.makeNewCharacter(character);
      newCharacter.mana = newCharacter.maxMana;
      updateCharacter(newCharacter);
      alert("battle won, to the next one!");
      updateFloor(floor);
      reset();
    }
    newEnemies = allEnemies[floor];
    return newEnemies;
  }
}

function AttackPlayer(character, enemies, setEnemyAttacks) {
  setEnemyAttacks([]);
  var enemyAttacks = [];
  character.refreshMana();

  var heap = new Heap(function (a, b) {
    return b.priority - a.priority;
  });

  enemies.forEach(function (enemy) {
    console.log(enemy);
    var attacked = false;
    if (enemy.health <= 0 || enemy.hasEffect("Stun")) {
      return;
    } else {
      enemy.attacks.forEach(function (attack) {
        heap.push(attack);
      });
      while (heap.nodes.length > 0) {
        let attack = heap.pop();
        if (!attacked && Math.random() <= attack.chance) {
          attacked = true;
          enemyAttacks.push(attack);
          AttackHelpers.Attack(enemy, attack, character);
          setEnemyAttacks(enemyAttacks);
        }
        if (character.health <= 0) {
          alert("you lose");
          window.location.reload();
        }
      }
    }
  });
}

export function AttackPlayerFromStun(
  character,
  enemies,
  setEnemyAttacks,
  updateCharacter,
  updateEnemies
) {
  let newEnemies = StateHelpers.makeNewEnemies(enemies);
  let newCharacter = StateHelpers.makeNewCharacter(character);
  AttackHelpers.reduceEnemiesEffectDurations(enemies);
  AttackHelpers.reduceCharacterEffectDurations(newCharacter);

  setEnemyAttacks([]);
  var enemyAttacks = [];
  character.refreshMana();

  var heap = new Heap(function (a, b) {
    return b.priority - a.priority;
  });

  newEnemies.forEach(function (enemy) {
    console.log(enemy);
    var attacked = false;
    if (enemy.health <= 0 || enemy.hasEffect("Stun")) {
      return;
    } else {
      enemy.attacks.forEach(function (attack) {
        heap.push(attack);
      });
      while (heap.nodes.length > 0) {
        let attack = heap.pop();
        if (!attacked && Math.random() <= attack.chance) {
          attacked = true;
          enemyAttacks.push(attack);
          AttackHelpers.Attack(enemy, attack, character);
          setEnemyAttacks(enemyAttacks);
        }
        if (character.health <= 0) {
          alert("you lose");
          window.location.reload();
        }
      }
    }
  });
  updateCharacter(newCharacter);
  updateEnemies(newEnemies);
}
