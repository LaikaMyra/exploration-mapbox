mapboxgl.accessToken = window.MAPBOX_ACCESS_TOKEN;

console.log('Access Token:', window.MAPBOX_ACCESS_TOKEN);

// Import the custom style
const customStyle = {
    version: 8,
    name: 'Faded White',
    sources: {
        'mapbox-streets': {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
        }
    },
    sprite: 'mapbox://sprites/mapbox/streets-v11',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    layers: [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#FFFFFF'
            }
        },
        {
            id: 'land',
            type: 'background',
            paint: {
                'background-color': '#F5F5F5'
            }
        },
        {
            id: 'water',
            type: 'fill',
            source: 'mapbox-streets',
            'source-layer': 'water',
            paint: {
                'fill-color': '#E6E6E6'
            }
        },
        {
            id: 'landuse',
            type: 'fill',
            source: 'mapbox-streets',
            'source-layer': 'landuse',
            paint: {
                'fill-color': '#F0F0F0'
            }
        },
        {
            id: 'building',
            type: 'fill',
            source: 'mapbox-streets',
            'source-layer': 'building',
            paint: {
                'fill-color': '#E0E0E0'
            }
        },
        {
            id: 'road',
            type: 'line',
            source: 'mapbox-streets',
            'source-layer': 'road',
            paint: {
                'line-color': '#CCCCCC',
                'line-width': 1
            }
        },
        {
            id: 'road-major',
            type: 'line',
            source: 'mapbox-streets',
            'source-layer': 'road',
            filter: ['in', 'class', 'primary', 'secondary', 'street', 'street_limited'],
            paint: {
                'line-color': '#999999',
                'line-width': 2
            }
        },
        {
            id: 'road-label',
            type: 'symbol',
            source: 'mapbox-streets',
            'source-layer': 'road',
            layout: {
                'text-field': '{name}',
                'text-size': 12,
                'text-anchor': 'center',
                'text-allow-overlap': false
            },
            paint: {
                'text-color': '#666666',
                'text-halo-color': '#FFFFFF',
                'text-halo-width': 1
            }
        }
    ]
};

const map = new mapboxgl.Map({
    container: 'map',
    style: customStyle,
    center: [-104.9876, 39.7405],
    zoom: 12
});

map.on('load', async () => {
    try {
        console.log('Map loaded, fetching data...');

        const [locationsResponse, techniciansResponse] = await Promise.all([
            fetch('/api/locations'),
            fetch('/api/technicians')
        ]);
        
        if (!locationsResponse.ok) throw new Error(`Locations HTTP error! status: ${locationsResponse.status}`);
        if (!techniciansResponse.ok) throw new Error(`Technicians HTTP error! status: ${techniciansResponse.status}`);
        
        const locations = await locationsResponse.json();
        const technicians = await techniciansResponse.json();

        console.log('Locations data:', locations);
        console.log('Technicians data:', technicians);

        // Process locations based on type
        locations.forEach(async location => {
            if (location.type === 'technician') {
                // Find the technician details
                const technician = technicians.find(tech => 
                    tech._id.$oid === location.technicianId.$oid
                );
                
                const markerElement = document.createElement('div');
                markerElement.className = 'marker-container';

                // Fetch the SVG asset and inject it
                const svgResponse = await fetch('/icons/icon-fieldVanModern.svg');
                const svgText = await svgResponse.text();

                markerElement.innerHTML = `
                    <div class="pin-wrapper">
                        <div class="van-icon">
                            ${svgText}
                        </div>
                        <div class="technician-name">${technician ? technician.name : 'Unknown'}</div>
                    </div>`;

                new mapboxgl.Marker({
                    element: markerElement
                })
                    .setLngLat(location.coordinates)
                    .setPopup(new mapboxgl.Popup().setHTML(`
                        <h3>${technician ? technician.name : 'Unknown Technician'}</h3>
                        <p>Status: ${technician ? technician.status : 'N/A'}</p>
                    `))
                    .addTo(map);

            } else if (location.type === 'job') {
                // Job location markers
                const jobMarker = document.createElement('div');
                jobMarker.className = 'job-marker';
                if (location.jobDetails && location.jobDetails.priority === 'high') {
                    jobMarker.classList.add('high-priority');
                }
                jobMarker.textContent = '⚡';

                new mapboxgl.Marker({
                    element: jobMarker,
                    color: '#FF0000' // Red for jobs (not used with custom element)
                })
                    .setLngLat(location.coordinates)
                    .setPopup(new mapboxgl.Popup().setHTML(`
                        <h3>Job: ${location.jobDetails.title}</h3>
                        <p>Status: ${location.jobDetails.status}</p>
                        <p>Priority: ${location.jobDetails.priority}</p>
                    `))
                    .addTo(map);
            }
        });

        // Zoom handler for technician names
        map.on('zoom', () => {
            const zoom = map.getZoom();
            const technicianNames = document.querySelectorAll('.technician-name');
            technicianNames.forEach(name => {
                name.style.display = zoom >= 14 ? 'block' : 'none';
            });
        });

    } catch (error) {
        console.error('Error loading map data:', error);
    }
});
