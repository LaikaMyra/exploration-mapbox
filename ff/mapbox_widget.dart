import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MapboxWidget extends StatefulWidget {
  final String mapboxAccessToken;
  final String apiBaseUrl;
  final Function(MapboxMapController)? onMapCreated;
  final Function(LatLng)? onMapClick;
  final bool showTechnicianNames;
  final bool showJobMarkers;
  final Map<String, dynamic>? initialCenter;
  final double initialZoom;

  const MapboxWidget({
    Key? key,
    required this.mapboxAccessToken,
    required this.apiBaseUrl,
    this.onMapCreated,
    this.onMapClick,
    this.showTechnicianNames = true,
    this.showJobMarkers = true,
    this.initialCenter = const {'lng': -104.9876, 'lat': 39.7405},
    this.initialZoom = 12.0,
  }) : super(key: key);

  @override
  State<MapboxWidget> createState() => _MapboxWidgetState();
}

class _MapboxWidgetState extends State<MapboxWidget> {
  MapboxMapController? mapController;
  List<Map<String, dynamic>> locations = [];
  List<Map<String, dynamic>> technicians = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final locationsResponse = await http.get(Uri.parse('${widget.apiBaseUrl}/api/locations'));
      final techniciansResponse = await http.get(Uri.parse('${widget.apiBaseUrl}/api/technicians'));

      if (locationsResponse.statusCode == 200 && techniciansResponse.statusCode == 200) {
        setState(() {
          locations = List<Map<String, dynamic>>.from(json.decode(locationsResponse.body));
          technicians = List<Map<String, dynamic>>.from(json.decode(techniciansResponse.body));
          isLoading = false;
        });
        _addMarkers();
      }
    } catch (e) {
      print('Error loading data: $e');
      setState(() => isLoading = false);
    }
  }

  void _addMarkers() {
    if (mapController == null) return;

    for (var location in locations) {
      if (location['type'] == 'technician' && widget.showTechnicianNames) {
        final technician = technicians.firstWhere(
          (tech) => tech['_id']['\$oid'] == location['technicianId']['\$oid'],
          orElse: () => {'name': 'Unknown', 'status': 'N/A'},
        );

        mapController!.addSymbol(
          SymbolOptions(
            geometry: LatLng(
              location['coordinates'][1],
              location['coordinates'][0],
            ),
            iconImage: 'van-icon',
            iconSize: 1.0,
            textField: technician['name'],
            textOffset: const Offset(0, 1.5),
            textSize: 12,
            textColor: '#000000',
          ),
        );
      } else if (location['type'] == 'job' && widget.showJobMarkers) {
        final jobDetails = location['jobDetails'] ?? {};
        final isHighPriority = jobDetails['priority'] == 'high';

        mapController!.addSymbol(
          SymbolOptions(
            geometry: LatLng(
              location['coordinates'][1],
              location['coordinates'][0],
            ),
            iconImage: isHighPriority ? 'high-priority-job' : 'job',
            iconSize: 1.0,
            textField: jobDetails['title'] ?? 'Job',
            textOffset: const Offset(0, 1.5),
            textSize: 12,
            textColor: '#000000',
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return MapboxMap(
      accessToken: widget.mapboxAccessToken,
      onMapCreated: (MapboxMapController controller) {
        mapController = controller;
        widget.onMapCreated?.call(controller);
        _addMarkers();
      },
      onMapClick: (point, coordinates) {
        widget.onMapClick?.call(coordinates);
      },
      initialCameraPosition: CameraPosition(
        target: LatLng(
          widget.initialCenter!['lat'],
          widget.initialCenter!['lng'],
        ),
        zoom: widget.initialZoom,
      ),
      styleString: MapboxStyles.MAPBOX_STREETS,
    );
  }
} 