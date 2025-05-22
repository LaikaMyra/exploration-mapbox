# Using the Mapbox Widget in FlutterFlow

This document provides examples and instructions for using the Mapbox widget in your FlutterFlow application.

## Basic Usage

1. **Import the Widget**
   In your FlutterFlow project, import the widget by adding it to your custom widgets:

   ```dart
   import 'package:mapbox_flutterflow_widget/mapbox_widget.dart';
   ```

2. **Add to Your Page**
   ```dart
   MapboxWidget(
     mapboxAccessToken: 'your_mapbox_token',
     apiBaseUrl: 'http://your-api-url',
     showTechnicianNames: true,
     showJobMarkers: true,
     initialCenter: {'lat': 39.7405, 'lng': -104.9876},
     initialZoom: 12.0,
   )
   ```

## Configuration Options

The widget supports the following configuration options:

- `mapboxAccessToken` (required): Your Mapbox access token
- `apiBaseUrl` (required): Base URL for your API endpoints
- `showTechnicianNames` (optional): Show/hide technician names (default: true)
- `showJobMarkers` (optional): Show/hide job markers (default: true)
- `initialCenter` (optional): Initial map center coordinates
- `initialZoom` (optional): Initial zoom level
- `onMapCreated` (optional): Callback when map is created
- `onMapClick` (optional): Callback when map is clicked

## Example with Custom Actions

```dart
MapboxWidget(
  mapboxAccessToken: 'your_mapbox_token',
  apiBaseUrl: 'http://your-api-url',
  onMapCreated: (controller) {
    // Handle map creation
    print('Map created');
  },
  onMapClick: (coordinates) {
    // Handle map click
    print('Clicked at: ${coordinates.latitude}, ${coordinates.longitude}');
  },
)
```

## Data Integration

The widget expects the following API endpoints:

1. `/api/locations` - Returns location data
2. `/api/technicians` - Returns technician data

Example response format:

```json
// /api/locations
[
  {
    "type": "technician",
    "coordinates": [longitude, latitude],
    "technicianId": {"$oid": "technician_id"}
  },
  {
    "type": "job",
    "coordinates": [longitude, latitude],
    "jobDetails": {
      "title": "Job Title",
      "status": "pending",
      "priority": "high"
    }
  }
]

// /api/technicians
[
  {
    "_id": {"$oid": "technician_id"},
    "name": "Technician Name",
    "status": "active"
  }
]
```

## Custom Styling

To customize the appearance of markers and map style:

1. Add custom icons to the `assets/icons/` directory
2. Update the `iconImage` property in the widget code
3. Modify the `styleString` property to use a different Mapbox style

## Troubleshooting

1. **Map Not Loading**
   - Verify Mapbox access token
   - Check API endpoint accessibility
   - Ensure proper CORS configuration

2. **Markers Not Showing**
   - Verify API response format
   - Check icon assets are properly included
   - Verify coordinates format

3. **Performance Issues**
   - Consider implementing pagination for large datasets
   - Use clustering for dense marker areas
   - Implement proper caching strategies 