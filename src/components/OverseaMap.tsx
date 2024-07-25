import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import LeafMapChangeView from './LeafMapChangeView';

const DefaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OverseaMapInterface {
    mapCenter: { 
        lat: number 
        lng: number
    };
}

const OverseaMap: React.FC<OverseaMapInterface> = ({mapCenter}) => {
    return (
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={16} style={{ height: '150px', width: '100%' }} attributionControl={false}>
            <LeafMapChangeView center={{lat: mapCenter.lat, lng: mapCenter.lng}}/>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[mapCenter.lat, mapCenter.lng]}>
            </Marker>
        </MapContainer>
    );
};

export default OverseaMap;