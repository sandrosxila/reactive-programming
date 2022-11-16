import { Observable } from "rxjs";
import { canvas, ctx } from "./setup_canvas";
import { Position } from "./index.d";

export type Star = Position & {size: number};

export function paintStars(stars: Star[]) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach((star) => ctx.fillRect(star.x, star.y, star.size, star.size));
}

const SPEED = 40;
const STAR_NUMBER = 250;
export const starStream$ = Observable.range(1, STAR_NUMBER)
  .map(() => ({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    size: Math.random() * 3 + 1,
  }))
  .toArray()
  .flatMap((starArray) =>
    Observable.interval(SPEED).map(() => {
      starArray.forEach((star) => {
        if (star.y >= canvas.height) {
          star.y = 0;
        }
        star.y += star.size;
      });

      return starArray;
    })
  );
