import { Observable } from "rxjs";
import { loadJSONP } from "./loadJSONP";

export const QUAKE_URL = `http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp`;

export const quakes$ = Observable.interval(5000)
  .startWith(0)
  .flatMap((num) => {
    return loadJSONP({
      url: QUAKE_URL,
      callbackName: "eqfeed_callback",
    }).retry(3);
  })
  .flatMap((result) => Observable.from(result.response.features))
  .distinct((quake) => quake.properties.code)
  .share();
