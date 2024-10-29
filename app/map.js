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

        // Add employee locations (blue pins)
        locations.forEach(location => {
            console.log('Adding location marker:', location);
            new mapboxgl.Marker({ color: '#0000FF' })
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
