# Mapbox Exploration for FlutterFlow

This project is a Mapbox-based location tracking and visualization system that has been adapted for use as a custom widget in FlutterFlow. The original Node.js implementation has been restructured to work seamlessly within the FlutterFlow environment.

## Project Overview

The application provides:
- Interactive Mapbox map visualization
- Location tracking and management
- Job and technician management
- Real-time data updates
- Integration with Mapbox Studio for style and icon management

## Architecture

The project consists of two main parts:
1. **Original Node.js Implementation** (`/app` directory)
   - Serves as a reference implementation
   - Uses MongoDB stand-in for data storage
   - Provides RESTful API endpoints
   - Integrates with Mapbox Studio for map styling and icons

2. **FlutterFlow Integration** (`/ff` directory)
   - Custom widget implementation
   - FlutterFlow-specific configurations
   - API integration layer

## Running the Original Implementation

1. **Prerequisites**
   - Docker and Docker Compose
   - Node.js 14 or later
   - Mapbox access token
   - Mapbox Studio account

2. **Environment Setup**
   Create a `.env` file with:
   ```
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   PORT=3000
   NODE_ENV=development
   MAPBOX_STYLE_URL=mapbox://styles/myrajames/cmb4i4ddo00er01swguqs183k
   ```

3. **Running with Docker**
   ```bash
   docker-compose up
   ```
   The application will be available at `http://localhost:3000`

## Mapbox Studio Integration

This project uses Mapbox Studio for managing map styles and icons. To work with the styles:

1. **Access Mapbox Studio**
   - Visit [Mapbox Studio](https://studio.mapbox.com)
   - Log in with your Mapbox account
   - Navigate to the style: `cmb4i4ddo00er01swguqs183k`

2. **Making Style Changes**
   - Edit the style in Mapbox Studio
   - Add or modify layers, colors, and icons
   - Click "Publish" to make changes live
   - Changes will automatically reflect in the application

3. **Working with Icons**
   - Upload custom icons in Mapbox Studio
   - Use the icon picker to add them to your style
   - Publish changes to make them available
   - Icons are served directly from Mapbox's CDN
   - No local icon assets are needed

4. **Style Versioning**
   - Mapbox Studio maintains version history
   - You can revert to previous versions if needed
   - Each published version gets a unique URL

## Data Structure

The application uses a MongoDB stand-in with the following collections:
- `locations.json`: Stores location data
- `jobs.json`: Stores job information
- `technicians.json`: Stores technician details

## API Endpoints

The server provides the following endpoints:
- `GET /api/locations`: Retrieve all locations
- `GET /api/jobs`: Retrieve all jobs
- `GET /api/technicians`: Retrieve all technicians

## FlutterFlow Integration

To use this as a custom widget in FlutterFlow:

1. **Widget Setup**
   - Import the widget code from the `/ff` directory
   - Configure the Mapbox access token in FlutterFlow
   - Set up API endpoints in your FlutterFlow backend

2. **Data Integration**
   - Configure API endpoints in FlutterFlow
   - Set up data models matching the JSON structure
   - Implement real-time updates if needed

3. **Customization**
   - Modify the widget parameters in FlutterFlow
   - Adjust styling to match your app's theme
   - Configure map interactions as needed

## Development Notes

- The MongoDB stand-in uses JSON files to simulate a database
- All API endpoints support CORS for cross-origin requests
- The server includes comprehensive error logging
- All map styles and icons are managed through Mapbox Studio

## Security Considerations

- Never expose your Mapbox access token in client-side code
- Implement proper authentication for API endpoints
- Use environment variables for sensitive configuration
- Consider implementing rate limiting for API endpoints

## Troubleshooting

1. **Map Not Loading**
   - Verify Mapbox access token
   - Check browser console for errors
   - Ensure Mapbox Studio style is published and accessible

2. **API Issues**
   - Verify JSON files exist in mongodb-standIn/collections
   - Check server logs for errors
   - Verify CORS configuration

3. **FlutterFlow Integration Issues**
   - Verify widget configuration
   - Check API endpoint accessibility
   - Ensure proper data model mapping 