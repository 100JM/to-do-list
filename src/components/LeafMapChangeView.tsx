import React from 'react';
import { useMap } from 'react-leaflet';

interface OverseaMapInterface {
    center: { 
        lat: number 
        lng: number
    };
};

const LeafMapChangeView: React.FC<OverseaMapInterface> = ({center}) => {
    const map = useMap();
    map.setView([center.lat, center.lng]);
    return null;
};

export default LeafMapChangeView;