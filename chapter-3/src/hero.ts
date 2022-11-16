import { Observable } from "rxjs";
import { drawTriangle } from "./helpers";
import { canvas } from "./setup_canvas";
import { Position } from "./index.d";

export function paintSpaceShip({ x, y }: Position) {
  drawTriangle(x, y, 20, "#ff0000", "up");
}

const getHeroY = () => canvas.height - 30;
const mouseMove: Observable<MouseEvent> = Observable.fromEvent(
  canvas,
  "mousemove"
);

export const spaceShip$ = mouseMove
  .map((event) => ({ x: event.clientX, y: getHeroY() }))
  .startWith({ x: canvas.width / 2, y: getHeroY() });
