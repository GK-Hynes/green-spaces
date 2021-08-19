mapboxgl.accessToken = mapToken;
console.log(greenspace);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: greenspace.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});
new mapboxgl.Marker().setLngLat(greenspace.geometry.coordinates).addTo(map);
