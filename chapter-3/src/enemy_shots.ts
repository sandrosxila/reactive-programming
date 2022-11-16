import { Observable } from "rxjs";
import { canvas } from "./setup_canvas";
import { Position } from "./index.d";
import { drawTriangle, getRandomInt } from "./helpers";

const SHOOTING_SPEED = 15;
const ENEMY_SHOOTING_FREQ = 750;
const ENEMY_FREQ = 1500;

function isVisible({ x, y }: Position) {
  const xInRange = -40 < x && x < canvas.width + 40;
  const yInRange = -40 < y && y < canvas.height + 40;
  return xInRange && yInRange;
}

export type Enemy = Position & { shots: Position[]; isDead?: boolean };

export function paintEnemies(enemies: Enemy[]) {
  enemies.forEach((enemy) => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, "#00ff00", "down");
    }

    enemy.shots.forEach((shot) => {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, "#00ffff", "down");
    });
  });
}

export const shooterEnemies$ = Observable.interval(ENEMY_FREQ).scan<
  number,
  Enemy[]
>((enemyArray) => {
  const enemy: Enemy = {
    x: Math.floor(Math.random() * canvas.width),
    y: -30,
    shots: [],
  };

  Observable.interval(ENEMY_SHOOTING_FREQ).subscribe(() => {
    if (!enemy.isDead) {
      enemy.shots.push({ x: enemy.x, y: enemy.y });
    }
    enemy.shots = enemy.shots.filter(isVisible);
  });

  enemyArray.push(enemy);
  return enemyArray
    .filter(isVisible)
    .filter((enemy) => !(enemy.isDead && enemy.shots.length === 0));
}, []);
