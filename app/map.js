mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // Default to New York City area
    zoom: 9
});

map.on('load', () => {
    // Add a person pin
    new mapboxgl.Marker({
        color: "#FF0000",
        draggable: false
    })
    .setLngLat([-74.5, 40])
    .setPopup(new mapboxgl.Popup().setHTML("<h3>Person</h3><p>This pin represents a person's location.</p>"))
    .addTo(map);

    // Add a building pin
    new mapboxgl.Marker({
        color: "#0000FF",
        draggable: false
    })
    .setLngLat([-74.45, 40.05])
    .setPopup(new mapboxgl.Popup().setHTML("<h3>Building</h3><p>This pin represents a building's location.</p>"))
    .addTo(map);
});