import { Observable } from "rxjs";
import { collision, drawTriangle } from "./helpers";
import { spaceShip$ } from "./hero";
import { canvas } from "./setup_canvas";
import { Position } from "./index.d";
import { Enemy } from "./enemy_shots";
import { ScoreSubject, SCORE_INCREASE } from "./score";

export const playerFiring$ = Observable.merge<MouseEvent | KeyboardEvent | {}>(
  Observable.fromEvent<MouseEvent>(canvas, "click"),
  Observable.fromEvent<KeyboardEvent>(document, "keydown").filter(
    (evt) => evt.key === " "
  )
)
  .startWith({})
  .sampleTime(200)
  .timestamp();

export const heroShots$ = Observable.combineLatest(
  playerFiring$,
  spaceShip$,
  (shotEvents, spaceShip: Position) => ({
    timestamp: shotEvents.timestamp,
    x: spaceShip.x,
    y: spaceShip.y,
  })
)
  .distinctUntilKeyChanged("timestamp")
  .scan<{ timestamp: number } & Position, Position[]>((shotArray, shot) => {
    shotArray.push({
      x: shot.x,
      y: shot.y,
    });

    return shotArray;
  }, []);

const SHOOTING_SPEED = 15;
export function paintHeroShots(heroShots: Position[], enemies: Enemy[]) {
  heroShots.slice(1).forEach((shot) => {
    for (let l = 0; l < enemies.length; l++) {
      const enemy = enemies[l];
      if (!enemy.isDead && collision(shot, enemy)) {
        ScoreSubject.next(SCORE_INCREASE)
        enemy.isDead = true;
        shot.x = shot.y = -100;
        break;
      }
    }
    shot.y -= SHOOTING_SPEED;
    drawTriangle(shot.x, shot.y, 5, "#ffff00", "up");
  });
}
