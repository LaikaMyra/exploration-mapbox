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

        const [locationsResponse, jobsResponse] = await Promise.all([
            fetch('./api/locations'),
            fetch('./api/jobs')
        ]);
        
        if (!locationsResponse.ok) throw new Error(`Locations HTTP error! status: ${locationsResponse.status}`);
        if (!jobsResponse.ok) throw new Error(`Jobs HTTP error! status: ${jobsResponse.status}`);
        
        const locations = await locationsResponse.json();
        const jobs = await jobsResponse.json();

        console.log('Locations data:', locations);
        console.log('Jobs data:', jobs);

        // Add employee locations (blue van icons)
        locations.forEach(location => {
            console.log('Adding location marker:', location);
            const vanIcon = document.createElement('div');
            vanIcon.innerHTML = `
                <svg width="40" height="24" viewBox="0 0 40 24" fill="#0000FF">
                    <path d="M35 8h-3V6.5c0-3-2.5-5.5-5.5-5.5H5C2.2 1 0 3.2 0 6v12c0 1.1.9 2 2 2h2c0-2.2 1.8-4 4-4s4 1.8 4 4h15c0-2.2 1.8-4 4-4s4 1.8 4 4h3c1.1 0 2-.9 2-2v-6c0-2.2-1.8-4-4-4zM8 17c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm25 0c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm5-7h-3V8h3v2z"/>
                    <path d="M3 10h24v4H3z" fill="#FFFFFF"/>
                </svg>`;

            new mapboxgl.Marker({
                element: vanIcon
            })
                .setLngLat(location.coordinates)
                .setPopup(new mapboxgl.Popup().setHTML(`
                    <h3>${location.name}</h3>
                    <p>Location ID: ${location.locationId}</p>
                `))
                .addTo(map);
        });

        // Add job locations (red pins)
        jobs.forEach(job => {
            console.log('Adding job marker:', job);
            new mapboxgl.Marker({ color: '#FF0000' })
                .setLngLat(job.location.coordinates)
                .setPopup(new mapboxgl.Popup().setHTML(`
                    <h3>${job.title}</h3>
                    <p>Job ID: ${job.jobId}</p>
                    <p>Status: ${job.status}</p>
                    <p>Priority: ${job.priority}</p>
                `))
                .addTo(map);
        });
    } catch (error) {
        console.error('Error loading map data:', error);
    }
});
