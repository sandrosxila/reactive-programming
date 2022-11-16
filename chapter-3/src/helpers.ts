import { ctx } from "./setup_canvas";
import { Position } from "./index.d";

export function drawTriangle(
  x: number,
  y: number,
  width: number,
  color: string,
  direction: "up" | "down"
) {
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.moveTo(x - width, y);

  ctx.lineTo(x, direction === "up" ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);

  ctx.fill();
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function collision(target1: Position, target2: Position) {
  return (
    target1.x > target2.x - 20 &&
    target1.x < target2.x + 20 &&
    target1.y > target2.y - 20 &&
    target1.y < target2.y + 20
  );
}
