import React from "react";
import {
  RenderHealth,
  RenderEffects,
  getAttackTooltip,
} from "./RenderElements";
import dynamic from "next/dynamic";
import { shake, pulse, wobble } from "react-animations";
import { StyleSheet, css } from "aphrodite";

const styles = StyleSheet.create({
  shake: {
    animationName: shake,
    animationDuration: "1s",
  },
  pulse: {
    animationName: pulse,
    animationDuration: "1s",
  },
  wobble: {
    animationName: wobble,
    animationDuration: "1s",
  },
});

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
      <ReactTooltip html={true} />
    </React.Fragment>
  );
}

function RenderAttacks(enemy) {
  return (
    <div className="attacks-container">
      <p className={"attackHeader"}>Attacks:</p>
      {enemy.attacks.map((attack, attackIndex) =>
        RenderAttack(attack, attackIndex)
      )}
    </div>
  );
}

function RenderEnemy({ enemy }) {
  if (enemy.animate) {
    return (
      <div className={css(styles[[enemy.animate]])}>
        <p style={{ fontSize: "5em", margin: "0px" }}>{enemy.emoji}</p>
        <h3 style={{ marginTop: "-10px" }}>{enemy.name}</h3>
        {RenderHealth(enemy.health, enemy.maxHealth)}
        {RenderAttacks(enemy)}
        {enemy.effects.length > 0 && RenderEffects(enemy)}
      </div>
    );
  }
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
        {Array.isArray(enemies) ? (
          enemies.map((enemy, index) => {
            return (
              <React.Fragment key={index}>
                <RenderEnemy enemy={enemy} />
              </React.Fragment>
            );
          })
        ) : (
          <div>
            <h1>You Win!</h1>
            <button className="btn" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
