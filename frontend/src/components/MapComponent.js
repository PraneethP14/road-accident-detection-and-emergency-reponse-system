import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

/**
 * MapComponent - Shows accident location on Google Maps
 * Falls back to OpenStreetMap if Google Maps unavailable
 */
function MapComponent({ latitude, longitude, showControls = true, height = '400px' }) {
  const [mapType, setMapType] = useState('google'); // 'google' or 'osm'

  // Format coordinates
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Validate coordinates
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Invalid coordinates</p>
        </div>
      </div>
    );
  }

  // OpenStreetMap URL (free, no API key needed)
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Map Toggle */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-sm text-gray-600">OpenStreetMap</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <MapPin className="w-4 h-4" />
              View in Maps
            </button>
            <button
              onClick={openDirections}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        {/* OpenStreetMap Embed (Free, no API key needed) */}
        <iframe
          src={osmUrl}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Accident Location Map"
        />
        
        {/* Coordinates Overlay */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="font-mono text-gray-700">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span> Accident Location</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${lat}, ${lng}`);
            alert('Coordinates copied to clipboard!');
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Copy Coordinates
        </button>
      </div>
    </div>
  );
}

export default MapComponent;
