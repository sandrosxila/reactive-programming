import { Observable, Observer } from "rxjs";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { Response } from "./data.d";

const QUAKE_URL = `http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp`;

const mapContainer = document.createElement("div");
mapContainer.id = "map";
mapContainer.style.height = "100vh";
document.body.appendChild(mapContainer);

const map = L.map("map").setView([33.858631, -118.279602], 7);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

function loadJSONP(settings: {
  url: string;
  callbackName: "eqfeed_callback";
}): Observable<{
  status: number;
  responseType: string;
  response: Response;
  originalEvent: Event;
}> {
  const { url, callbackName } = settings;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  window[callbackName] = (data: Response) => {
    window[callbackName].data = data;
  };

  return Observable.create(
    (
      observer: Observer<{
        status: number;
        responseType: string;
        response: Response;
        originalEvent: Event;
      }>
    ) => {
      const handler = (e: Event) => {
        const status = e.type === "error" ? 400 : 200;
        const response = window[callbackName].data;

        if (status === 200) {
          observer.next({
            status,
            responseType: "jsonp",
            response,
            originalEvent: e,
          });
        } else {
          observer.error({
            type: "error",
            status,
            originalEvent: e,
          });
        }
      };

      script.onload = handler;
      script.onerror = (e) => typeof e !== "string" && handler(e);

      const head = document.head;
      head.insertBefore(script, head.firstChild);
    }
  );
}

const quakes$ = Observable.interval(5000)
  .startWith(0)
  .flatMap(() =>
    loadJSONP({ url: QUAKE_URL, callbackName: "eqfeed_callback" }).retry(3)
  )
  .flatMap((result) => Observable.from(result.response.features))
  .distinct((quake: { properties: { code: number } }) => quake.properties.code);

quakes$.subscribe((quake: any) => {
  const coords: number[] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;
  L.circle([coords[1], coords[0]], size).addTo(map);
});
