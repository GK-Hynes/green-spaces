mapboxgl.accessToken = mapToken;
console.log(greenspace);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: greenspace.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});
new mapboxgl.Marker()
  .setLngLat(greenspace.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${greenspace.title}</h3><p>${greenspace.location}</p>`
    )
  )
  .addTo(map);
