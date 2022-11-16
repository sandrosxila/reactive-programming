import { Observable } from "rxjs";

export function isHovering(element: Element) {
  const over = Observable.fromEvent(element, "mouseover").map(() => true);
  const out = Observable.fromEvent(element, "mouseout").map(() => false);

  return over.merge(out);
}
