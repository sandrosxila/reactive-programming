export type Geometry = {
  coordinates: number[];
}

export type Properties = {
  code: number;
  mag: number;
  time: number;
  place: string;
  net: string;
}

export type Feature = {
  properties: Properties
  geometry: Geometry
  id: string,
  type: "Feature"
}

export type Response = {
  features: Feature[];
};
