mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11', // stylesheet location
    center: filmspot.geometry.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(filmspot.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${filmspot.title}</h3><p>${filmspot.location}</p>`
            )
    )
    .addTo(map) 