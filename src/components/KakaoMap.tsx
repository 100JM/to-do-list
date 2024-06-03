import { Map, MapMarker } from 'react-kakao-maps-sdk'

interface KakaoMapInterface {
    mapCenter: { 
        lat: number 
        lng: number
    };
}

const KakaoMap: React.FC<KakaoMapInterface> = ({mapCenter}) => {
    return (
        <Map
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ height: '150px' }}
            level={5}
        >
            <MapMarker position={{ lat: mapCenter.lat, lng: mapCenter.lng }} />
        </Map>
    )
}

export default KakaoMap