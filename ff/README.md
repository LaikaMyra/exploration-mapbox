# Mapbox Exploration for FlutterFlow

This project is a Mapbox-based location tracking and visualization system that has been adapted for use as a custom widget in FlutterFlow. The original Node.js implementation has been restructured to work seamlessly within the FlutterFlow environment.

## Project Overview

The application provides:
- Interactive Mapbox map visualization
- Location tracking and management
- Job and technician management
- Real-time data updates

## Architecture

The project consists of two main parts:
1. **Original Node.js Implementation** (`/app` directory)
   - Serves as a reference implementation
   - Uses MongoDB stand-in for data storage
   - Provides RESTful API endpoints

2. **FlutterFlow Integration** (`/ff` directory)
   - Custom widget implementation
   - FlutterFlow-specific configurations
   - API integration layer

## Running the Original Implementation

1. **Prerequisites**
   - Docker and Docker Compose
   - Node.js 14 or later
   - Mapbox access token

2. **Environment Setup**
   Create a `.env` file with:
   ```
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   PORT=3000
   NODE_ENV=development
   ```

3. **Running with Docker**
   ```bash
   docker-compose up
   ```
   The application will be available at `http://localhost:3000`

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
- Static files (icons, CSS, JS) are served from the `/app` directory

## Security Considerations

- Never expose your Mapbox access token in client-side code
- Implement proper authentication for API endpoints
- Use environment variables for sensitive configuration
- Consider implementing rate limiting for API endpoints

## Troubleshooting

1. **Map Not Loading**
   - Verify Mapbox access token
   - Check browser console for errors
   - Ensure all required files are being served

2. **API Issues**
   - Verify JSON files exist in mongodb-standIn/collections
   - Check server logs for errors
   - Verify CORS configuration

3. **FlutterFlow Integration Issues**
   - Verify widget configuration
   - Check API endpoint accessibility
   - Ensure proper data model mapping 