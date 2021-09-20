import React, { useState } from "react";
import * as Attack from "../../library/battle/attack";

function TerminalInput(props) {
  const {
    history,
    updateHistory,
    character,
    updateCharacter,
    enemies,
    updateEnemies,
  } = props;
  // for rendering
  const [showAttacks, setShowAttacks] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedAttackId, setSelectedAttackId] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  // more useful data
  const [selectedAttack, setSelectedAttack] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  function handleSubmit(event) {
    console.log(event);
    Attack.Attack(selectedAttack, selectedTarget, enemies, updateEnemies);
    event.preventDefault();
  }

  function handleButtonClick(event) {
    function reset() {
      setShowTargets(false);
      setSelectedAttackId("");
      setSelectedAttack(false);
      setSelectedTarget("");
      setSelectedTargetId("");
      setShowSubmit(false);
    }
    const value = event.target.value;
    console.log(value);
    reset();
    switch (value) {
      case "attack":
        setShowAttacks(value);
        setShowItems(!value);
        break;
      case "item":
        setShowItems(value);
        setShowAttacks(!value);
        break;
      default:
        throw "not an option";
    }
  }

  function handleAttackButtonClick(event) {
    console.log(event.target.value);
    console.log(event.target.name);
    setSelectedAttackId(parseInt(event.target.value));
    setSelectedAttack(event.target.name);
    if (Array.isArray(enemies)) {
      setShowTargets(true);
    } else {
      setSelectedTarget(enemies);
      setShowSubmit(true);
    }
  }

  function handleTargetButtonClick(event) {
    console.log(event.target.value);
    console.log(event.target.name);
    setSelectedTargetId(parseInt(event.target.value));
    setSelectedTarget(event.target.name);
    setShowSubmit(true);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <h4>Select an Option</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <button
            type="button"
            className={showAttacks ? "btn form-btn selected" : "btn form-btn"}
            style={{ marginBottom: "1.33em" }}
            value="attack"
            onClick={handleButtonClick}
          >
            Show Attacks
          </button>
          <button
            type="button"
            className={showItems ? "btn form-btn selected" : "btn form-btn"}
            style={{ marginBottom: "1.33em" }}
            value="item"
            onClick={handleButtonClick}
          >
            Show Items
          </button>
          {showAttacks && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {character.attacks.map((attack, index) => {
                return (
                  <button
                    type="button"
                    className={
                      selectedAttackId === index
                        ? "btn form-btn selected"
                        : "btn form-btn"
                    }
                    style={{ marginBottom: "1.33em" }}
                    value={index}
                    name={attack.name}
                    key={index}
                    onClick={handleAttackButtonClick}
                  >
                    {attack.name}
                  </button>
                );
              })}
            </div>
          )}
          {showTargets && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {Array.isArray(enemies) &&
                enemies.map((enemy, index) => {
                  return (
                    <button
                      type="button"
                      className={
                        selectedTargetId === index
                          ? "btn form-btn selected"
                          : "btn form-btn"
                      }
                      style={{ marginBottom: "1.33em" }}
                      value={index}
                      name={enemy.id}
                      key={index}
                      onClick={handleTargetButtonClick}
                    >
                      {enemy.name}
                    </button>
                  );
                })}
            </div>
          )}
          {showSubmit && (
            <button
              type="submit"
              className="btn form-btn"
              style={{ marginBottom: "1.33em", backgroundColor: "#C50F1F" }}
              onClick={handleSubmit}
            >
              {showAttacks ? "Attack" : "Use Item"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default TerminalInput;
