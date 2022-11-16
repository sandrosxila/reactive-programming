import { Observable } from "rxjs";
import { setUpCanvas } from "./setup_canvas";
import { paintSpaceShip, spaceShip$ } from "./hero";
import { paintStars, Star, starStream$ } from "./starfield";
import { shooterEnemies$, Enemy, paintEnemies } from "./enemy_shots";
import { heroShots$, paintHeroShots } from "./hero_shots";
import { Position } from "./index.d";
import { collision } from "./helpers";
import { paintScore, score$ } from "./score";

setUpCanvas();

function renderScene(actors: {
  stars: Star[];
  spaceShip: Position;
  enemies: Enemy[];
  heroShots: Position[];
  score: number;
}) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceShip);
  paintEnemies(actors.enemies);
  paintHeroShots(actors.heroShots, actors.enemies);
  paintScore(actors.score);
}

function gameOver(ship: Position, enemies: Enemy[]) {
  return enemies.some((enemy) => {
    if (collision(ship, enemy)) {
      return true;
    }

    return enemy.shots.some((shot) => collision(ship, shot));
  });
}

const SPEED = 40;
const game$ = Observable.combineLatest(
  starStream$,
  spaceShip$,
  shooterEnemies$,
  heroShots$,
  score$,
  (stars, spaceShip, enemies, heroShots, score) => ({
    stars,
    spaceShip,
    enemies,
    heroShots,
    score,
  })
).sampleTime(SPEED);

Observable.fromEvent(document, "DOMContentLoaded").subscribe(() => {
  game$
    .takeWhile((actors) => !gameOver(actors.spaceShip, actors.enemies))
    .subscribe(renderScene);
});
