mapboxgl.accessToken = window.MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-104.9876, 39.7405], // Denver coordinates
    zoom: 12
});

map.on('load', () => {
    // Add pins
    const pins = [
        { lngLat: [-104.9876, 39.7405], color: '#FF0000' },
        { lngLat: [-104.9800, 39.7500], color: '#00FF00' },
        { lngLat: [-105.0000, 39.7300], color: '#0000FF' }
    ];

    pins.forEach((pin, index) => {
        new mapboxgl.Marker({ color: pin.color })
            .setLngLat(pin.lngLat)
            .addTo(map);
    });
});
