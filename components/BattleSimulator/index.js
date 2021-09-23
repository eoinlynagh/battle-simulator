import { useState } from "react";
import TerminalOutput from "../TerminalOutput";
import { makeCharacter } from "../../library/generation/characterMaker";
import makeAllEnemies from "../../library/generation/makeAllEnemies";
import GetNewAttackModal from "../modals/GetNewAttackModal";

export default function BattleSimulator(props) {
  const allEnemies = makeAllEnemies();

  const [character, updateCharacter] = useState(makeCharacter());
  const [floor, setFloor] = useState(0);
  const [enemies, setEnemies] = useState(allEnemies[floor]);
  const [enemyAttacks, setEnemyAttacks] = useState([]);
  const [showAttackModal, setShowAttackModal] = useState(false);

  function handleAttackModal() {
    if (showAttackModal) {
      setShowAttackModal(false);
    } else {
      setShowAttackModal(true);
    }
  }

  return (
    <>
      <TerminalOutput
        character={character}
        updateCharacter={updateCharacter}
        enemies={enemies}
        allEnemies={allEnemies}
        updateEnemies={setEnemies}
        floor={floor}
        updateFloor={setFloor}
        enemyAttacks={enemyAttacks}
        setEnemyAttacks={setEnemyAttacks}
        handleAttackModal={handleAttackModal}
      />

      <GetNewAttackModal
        showAttackModal={showAttackModal}
        handleAttackModal={handleAttackModal}
        character={character}
        updateCharacter={updateCharacter}
      />
    </>
  );
}
