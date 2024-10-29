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
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#0000FF">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
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
