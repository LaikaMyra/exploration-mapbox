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
        locations.forEach(location => {
            if (location.type === 'technician') {
                // Find the technician details
                const technician = technicians.find(tech => 
                    tech._id.$oid === location.technicianId.$oid
                );
                
                const markerElement = document.createElement('div');
                markerElement.className = 'marker-container';
                
                markerElement.innerHTML = `
                    <div class="pin-wrapper">
                        <div class="van-icon">
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="#0000FF">
                                <path d="M35 8h-3V6.5c0-3-2.5-5.5-5.5-5.5H5C2.2 1 0 3.2 0 6v12c0 1.1.9 2 2 2h2c0-2.2 1.8-4 4-4s4 1.8 4 4h15c0-2.2 1.8-4 4-4s4 1.8 4 4h3c1.1 0 2-.9 2-2v-6c0-2.2-1.8-4-4-4zM8 17c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm25 0c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm5-7h-3V8h3v2z"/>
                            </svg>
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
