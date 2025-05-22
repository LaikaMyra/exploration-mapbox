mapboxgl.accessToken = window.MAPBOX_ACCESS_TOKEN;

console.log('Access Token:', window.MAPBOX_ACCESS_TOKEN);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-104.9876, 39.7405],
    zoom: 12
});

map.on('load', async () => {
    try {
        console.log('Map loaded, fetching data...');

        const [locationsResponse, techniciansResponse] = await Promise.all([
            fetch('./api/locations'),
            fetch('./api/technicians')
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
                const svgResponse = await fetch('../icons/icon-fieldVanModern.svg');
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

                new mapboxgl.Marker({
                    element: jobMarker,
                    color: '#FF0000' // Red for jobs
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
