mapboxgl.accessToken = window.MAPBOX_ACCESS_TOKEN;

console.log('Access Token:', window.MAPBOX_ACCESS_TOKEN);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/myrajames/cmb4i4ddo00er01swguqs183k?nocache=1',
    center: [-104.9876, 39.7405],
    zoom: 12
});

map.on('load', () => {
    console.log('Map loaded, using Mapbox Studio datastreams');
    
    // The map will automatically use the layers defined in the Mapbox Studio style
    // No need to manually add markers as they are handled by the style configuration
    
    // Add hover effects for technician markers
    map.on('mouseenter', 'technicians', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'technicians', () => {
        map.getCanvas().style.cursor = '';
    });

    // Add hover effects for job markers
    map.on('mouseenter', 'jobs', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'jobs', () => {
        map.getCanvas().style.cursor = '';
    });

    // Add click handlers for popups
    map.on('click', 'technicians', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const technician = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <div class="technician-popup">
                    <h3>${technician.name}</h3>
                    <p>Status: <span class="status ${technician.status.toLowerCase().replace(' ', '-')}">${technician.status}</span></p>
                    ${technician.status.toLowerCase() === 'available' ? '<button class="assign-job-btn">Assign To Job</button>' : ''}
                </div>
            `)
            .addTo(map);

        // Add click handler for the assign job button
        const popupElement = document.querySelector('.mapboxgl-popup-content');
        if (popupElement) {
            const assignButton = popupElement.querySelector('.assign-job-btn');
            if (assignButton) {
                assignButton.addEventListener('click', () => {
                    console.log('Assign job to technician:', technician.name);
                    // Add your job assignment logic here
                });
            }
        }
    });

    map.on('click', 'jobs', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const job = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <div class="job-popup ${job.priority === 'high' ? 'high-priority' : ''}">
                    <h3>${job.title}</h3>
                    <p>Status: ${job.status}</p>
                    <p>Priority: <span class="priority ${job.priority}">${job.priority}</span></p>
                </div>
            `)
            .addTo(map);
    });

    // Enhanced zoom handler for labels
    map.on('zoom', () => {
        const zoom = map.getZoom();
        const minZoomForLabels = 11;
        
        // Update visibility of technician labels
        if (zoom >= minZoomForLabels) {
            map.setLayoutProperty('technician-labels', 'visibility', 'visible');
            map.setLayoutProperty('job-labels', 'visibility', 'visible');
        } else {
            map.setLayoutProperty('technician-labels', 'visibility', 'none');
            map.setLayoutProperty('job-labels', 'visibility', 'none');
        }
    });

    // Set initial label visibility based on starting zoom
    const initialZoom = map.getZoom();
    if (initialZoom < 11) {
        map.setLayoutProperty('technician-labels', 'visibility', 'none');
        map.setLayoutProperty('job-labels', 'visibility', 'none');
    }
});
