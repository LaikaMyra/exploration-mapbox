mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-104.9903, 39.7392], // Denver coordinates
    zoom: 12 // Increased zoom level for better city view
});

map.on('load', () => {
    // Add a person pin (example: Denver Union Station)
    new mapboxgl.Marker({
        color: "#FF0000",
        draggable: false
    })
    .setLngLat([-104.9999, 39.7526])
    .setPopup(new mapboxgl.Popup().setHTML("<h3>Person</h3><p>Denver Union Station area</p>"))
    .addTo(map);

    // Add a building pin (example: Colorado State Capitol)
    new mapboxgl.Marker({
        color: "#0000FF",
        draggable: false
    })
    .setLngLat([-104.9848, 39.7393])
    .setPopup(new mapboxgl.Popup().setHTML("<h3>Building</h3><p>Colorado State Capitol</p>"))
    .addTo(map);
});