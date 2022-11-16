import { Observable } from "rxjs";

export const table = document.getElementById("quakes_info") as HTMLTableElement;

export function makeRow(props: {
  net: string;
  code: number;
  time: number;
  place: string;
  mag: number;
}) {
  const row = document.createElement("tr");
  row.id = `${props.net}${props.code}`;

  const time = new Date(props.time).toString();

  [props.place, props.mag, time].forEach((text) => {
    const cell = document.createElement("td");
    cell.textContent = String(text);
    row.appendChild(cell);
  });

  return row;
}

export function getRowFromEvent(event: keyof HTMLElementEventMap) {
  return Observable.fromEvent<Event>(table, event)
    .filter(({ target }) => {
      return !!((target as Element).tagName === "TD" && ((target as Element).parentNode as Element)?.id.length);
    })
    .pluck<Event, Element>("target", "parentNode")
    .distinctUntilChanged();
}
