# Mapbox Exploration for FlutterFlow

This directory contains the custom widget and integration code for using Mapbox within FlutterFlow.

## FlutterFlow Integration

To use this as a custom widget in FlutterFlow:

1. **Widget Setup**
   - Import the widget code from the `/ff` directory into your FlutterFlow project.
   - Configure your Mapbox access token in FlutterFlow.
   - Set up API endpoints in your FlutterFlow backend to match your data models.

2. **Data Integration**
   - Configure API endpoints in FlutterFlow.
   - Set up data models matching the expected JSON structure (locations, jobs, technicians).
   - Implement real-time updates if needed.

3. **Customization**
   - Modify widget parameters in FlutterFlow as needed.
   - Adjust styling to match your app's theme.
   - Configure map interactions and popups as required.

---

## Suggestions for Setting Up a Flutter/DART Local Environment (Future Roadmap)

To streamline development and avoid converting from a JS server to Dart, consider the following setup for a local Flutter/Dart environment:

1. **Install Flutter & Dart**
   - [Flutter Install Guide](https://docs.flutter.dev/get-started/install)
   - Ensure Dart SDK is included (comes with Flutter)

2. **Set Up a Local Flutter Project**
   - `flutter create my_mapbox_project`
   - Open the project in your preferred IDE (VS Code, Android Studio, etc.)

3. **Add Dependencies**
   - Add `mapbox_gl` for Mapbox integration
   - Add `http` for API calls
   - Add `provider` or `riverpod` for state management (optional)

4. **Environment Variables**
   - Use a `.env` or similar approach for storing your Mapbox access token and API URLs
   - Consider using the `flutter_dotenv` package

5. **API Layer**
   - Implement Dart services to fetch data from your backend (locations, jobs, technicians)
   - Structure your models to match the backend JSON

6. **Widget Development**
   - Build custom widgets for map markers, popups, and overlays
   - Use assets and icons directly from Mapbox Studio where possible

7. **Testing & Hot Reload**
   - Use Flutter's hot reload for rapid UI iteration
   - Write unit and widget tests for reliability

8. **Deployment**
   - Prepare for web, iOS, and Android deployment as needed

---

**Note:** This roadmap will be implemented in the future to enable a fully Dart/Flutter-native workflow for Mapbox integration in FlutterFlow projects. 