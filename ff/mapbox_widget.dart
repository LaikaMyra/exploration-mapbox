import 'package:flutter/material.dart';
import 'package:mapbox_gl/mapbox_gl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

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
  String? vanIconSvg;

  // Custom style for faded white theme
  static const String customStyle = '''
{
  "version": 8,
  "name": "Faded White",
  "sources": {
    "mapbox-streets": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v8"
    }
  },
  "sprite": "mapbox://sprites/mapbox/streets-v11",
  "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#FFFFFF"
      }
    },
    {
      "id": "land",
      "type": "background",
      "paint": {
        "background-color": "#F5F5F5"
      }
    },
    {
      "id": "water",
      "type": "fill",
      "source": "mapbox-streets",
      "source-layer": "water",
      "paint": {
        "fill-color": "#E6E6E6"
      }
    },
    {
      "id": "landuse",
      "type": "fill",
      "source": "mapbox-streets",
      "source-layer": "landuse",
      "paint": {
        "fill-color": "#F0F0F0"
      }
    },
    {
      "id": "building",
      "type": "fill",
      "source": "mapbox-streets",
      "source-layer": "building",
      "paint": {
        "fill-color": "#E0E0E0"
      }
    },
    {
      "id": "road",
      "type": "line",
      "source": "mapbox-streets",
      "source-layer": "road",
      "paint": {
        "line-color": "#CCCCCC",
        "line-width": 1
      }
    },
    {
      "id": "road-major",
      "type": "line",
      "source": "mapbox-streets",
      "source-layer": "road",
      "filter": ["in", "class", "primary", "secondary", "street", "street_limited"],
      "paint": {
        "line-color": "#999999",
        "line-width": 2
      }
    },
    {
      "id": "road-label",
      "type": "symbol",
      "source": "mapbox-streets",
      "source-layer": "road",
      "layout": {
        "text-field": "{name}",
        "text-size": 12,
        "text-anchor": "center",
        "text-allow-overlap": false
      },
      "paint": {
        "text-color": "#666666",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1
      }
    }
  ]
}
''';

  @override
  void initState() {
    super.initState();
    _loadAssets();
    _loadData();
  }

  Future<void> _loadAssets() async {
    try {
      vanIconSvg = await rootBundle.loadString('assets/icons/icon-fieldVanModern.svg');
    } catch (e) {
      print('Error loading assets: $e');
    }
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

        // Add the van icon to the map style
        mapController!.addImage(
          'van-icon',
          vanIconSvg ?? '',
          SvgImageProperties(
            scale: 1.0,
          ),
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

        // Add job marker to the map style
        mapController!.addImage(
          isHighPriority ? 'high-priority-job' : 'job',
          '⚡',
          SvgImageProperties(
            scale: 1.0,
          ),
        );

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
      styleString: customStyle, // Use our custom style
    );
  }
} 