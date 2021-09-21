import React from "react";
import {
  RenderHealth,
  RenderEffects,
  getAttackTooltip,
} from "./RenderElements";
import dynamic from "next/dynamic";

const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
});

function RenderAttack(attack, attackIndex) {
  return (
    <React.Fragment key={attackIndex}>
      <p
        style={{
          color: "#C19C00",
          textDecoration: "underline",
          margin: "0px",
        }}
        data-tip={attack.getTooltip()}
      >
        {attack.name}
      </p>
      &nbsp;
      <ReactTooltip html={true} />
    </React.Fragment>
  );
}

function RenderAttacks(enemy) {
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        textAlign: "center",
        marginTop: "-1em",
      }}
    >
      <p style={{ marginTop: "0px" }}>Attacks:</p>&nbsp;
      {enemy.attacks.map((attack, attackIndex) =>
        RenderAttack(attack, attackIndex)
      )}
    </div>
  );
}

function RenderEnemy({ enemy }) {
  return (
    <div>
      <p style={{ fontSize: "5em", margin: "0px" }}>{enemy.emoji}</p>
      <h3 style={{ marginTop: "-10px" }}>{enemy.name}</h3>
      {RenderHealth(enemy.health, enemy.maxHealth)}
      {RenderAttacks(enemy)}
      {enemy.effects.length > 0 && RenderEffects(enemy)}
    </div>
  );
}

export default function RenderEnemies({ enemies }) {
  return (
    <div
      id="enemies"
      style={{
        alignSelf: "flex-start",
        textAlign: "center",
      }}
    >
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {enemies.map((enemy, index) => {
          return (
            <React.Fragment key={index}>
              <RenderEnemy enemy={enemy} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
