import { Observable } from "rxjs";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { getRowFromEvent, makeRow, table } from "./tableHelpers";
import { Feature, Properties } from "./data";
import { quakes$ } from "./quake";
import { socket$ } from "./socket";

const map = L.map("map").setView([33.858631, -118.279602], 7);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

const codeLayers: Record<string, number> = {};
const quakeLayer = L.layerGroup([] as L.Circle[]).addTo(map);

getRowFromEvent("mouseover")
  .pairwise()
  .subscribe(([prevRow, currRow]) => {
    const prevCircle = quakeLayer.getLayer(codeLayers[prevRow.id]) as L.Circle;
    const currCircle = quakeLayer.getLayer(codeLayers[currRow.id]) as L.Circle;
    prevCircle.setStyle({ color: "#0000ff" });
    currCircle.setStyle({ color: "#ff0000" });
  });

getRowFromEvent("click").subscribe((row) => {
  const circle = quakeLayer.getLayer(codeLayers[row.id]) as L.Circle;
  map.panTo(circle.getLatLng());
});

Observable.fromEvent(document, "DOMContentLoaded").subscribe(() => {

  quakes$
    .pluck<Feature, Properties>("properties")
    .map(makeRow)
    .bufferTime(500)
    .filter((rows) => rows.length > 0)
    .map((rows) => {
      const fragment = document.createDocumentFragment();

      rows.forEach((row) => {
        row.style.cursor = "pointer";
        fragment.appendChild(row);
      });
      return fragment;
    })
    .subscribe((fragment) => table.appendChild(fragment));

  quakes$.subscribe((quake) => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;
    const circle = L.circle([coords[1], coords[0]], size).addTo(map);
    quakeLayer.addLayer(circle);
    codeLayers[quake.id] = quakeLayer.getLayerId(circle);
  });

  quakes$.bufferCount(100).subscribe((quakes) => {
    const quakesData = quakes.map((quake) => ({
      id: quake.properties.net + quake.properties.code,
      lat: quake.geometry.coordinates[1],
      lng: quake.geometry.coordinates[0],
      mag: quake.properties.mag,
    }));
    socket$.next(JSON.stringify({ quakes: quakesData }));
  });

  socket$.subscribe((data) => {
    // retrieved data from the socket
    console.log(data);
  });
});
