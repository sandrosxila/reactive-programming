import { ctx } from "./setup_canvas";
import * as Rx from "rxjs";

export function paintScore(score: number) {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText(`Score: ${score}`, 40, 43);
}

export const SCORE_INCREASE = 10;
export const ScoreSubject = new Rx.BehaviorSubject(0);
export const score$ = ScoreSubject.scan((prev, cur) => prev + cur, 0)