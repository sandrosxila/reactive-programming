import { Observable } from "rxjs";
import { drawTriangle, getRandomInt } from "./helpers";
import { canvas } from "./setup_canvas";

export function paintEnemies(enemies: { x: number; y: number }[]) {
  enemies.forEach((enemy) => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    drawTriangle(enemy.x, enemy.y, 20, "#00ff00", "down");
  });
}

const ENEMY_FREQ = 1500;
export const enemies$ = Observable.interval(ENEMY_FREQ).scan<
  number,
  { x: number; y: number }[]
>((enemyArray) => {
  const enemy = {
    x: Math.floor(Math.random() * canvas.width),
    y: -30,
  };

  enemyArray.push(enemy);

  console.log(enemyArray)

  return enemyArray;
}, []);
