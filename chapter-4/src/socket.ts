import { Observable } from "rxjs";

export const socket$ = Observable.webSocket<string>("ws://localhost:5000");
