import { WebSocket, WebSocketServer } from "ws";
import { from, fromEvent, mergeMap, scan } from "rxjs";

type Quake = {
  id: string;
  lat: number;
  lng: number;
  mag: number;
};

function onConnect(ws: WebSocket) {
  console.log("Client connected on localhost:5000");
  fromEvent(ws, "message", (quake: { data: string }) => {
    const quakeData: {
      quakes: Quake[];
    } = JSON.parse(quake.data);
    return quakeData;
  })
    .pipe(
      mergeMap(({ quakes }) => from(quakes)),
      scan((boundsArray, quake) => {
        const bounds = [
          quake.lng - 0.3,
          quake.lat - 0.15,
          quake.lng + 0.3,
          quake.lat + 0.15,
        ].map(
          (coordinate) => coordinate.toString().match(/\-?\d+(\.\-?\d{2})?/)[0]
        );
        const finalBounds = boundsArray.concat(bounds);
        return finalBounds.slice(Math.max(finalBounds.length - 50, 0));
      }, [] as string[])
    )
    .subscribe((boundsArray) => {
      ws.send(
        JSON.stringify({
          boundsArray,
        })
      );
    });
}

const Server = new WebSocketServer({ port: 5000 });
fromEvent(Server, "connection", (ws: WebSocket) => ws).subscribe(onConnect);
