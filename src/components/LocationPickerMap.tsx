import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function LocationPickerMap({ 
  onLocationSelect, 
  initialLocation 
}: { 
  onLocationSelect: (locationName: string) => void,
  initialLocation: {lat: number, lng: number} 
}) {
  const [position, setPosition] = useState<any>(initialLocation);

  const handleLocationSelect = async (latlng: any) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      const address = data.address;
      // create a nice short string
      const name = address.suburb || address.neighbourhood || address.city_district || address.city || data.display_name.split(',')[0];
      onLocationSelect(name);
    } catch (e) {
      onLocationSelect(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    }
  };

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden border-2 border-gray-200 mt-2 z-0 relative">
      <MapContainer center={[initialLocation.lat, initialLocation.lng]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
}
