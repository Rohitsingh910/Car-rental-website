import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Fix Leaflet's default icon path issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204933.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function LiveTrackingMap({ bookingId, initialLocation }: { bookingId: string, initialLocation: { lat: number, lng: number } }) {
  const [driverLocation, setDriverLocation] = useState(initialLocation);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl);

    socket.emit('join_booking_room', bookingId);

    socket.on('driver_location_update', (data: { lat: number, lng: number }) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.disconnect();
    };
  }, [bookingId]);

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-gray-100 mt-4 relative z-0">
      <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carIcon}>
          <Popup>
            Driver's Current Location
          </Popup>
        </Marker>
        <RecenterAutomatically lat={driverLocation.lat} lng={driverLocation.lng} />
      </MapContainer>
    </div>
  );
}
