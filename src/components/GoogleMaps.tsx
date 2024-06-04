import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

interface GoogleMapsInterface {
    mapCenter: {
        lat: number
        lng: number
    };
}

const libraries: ('places')[] = ['places'];

const GoogleMaps: React.FC<GoogleMapsInterface> = ({ mapCenter }) => {
    const googleMapApikey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapApikey,
        libraries,
    });

    if (!isLoaded) return <div className="text-center">Loading...</div>;

    return (
        <GoogleMap mapContainerStyle={{ height: "150px" }} center={mapCenter} zoom={10}>
            <MarkerF position={mapCenter} />
        </GoogleMap>
    )
}

export default GoogleMaps;