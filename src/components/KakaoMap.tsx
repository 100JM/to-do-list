import { Map, MapMarker, ZoomControl, useKakaoLoader } from 'react-kakao-maps-sdk'

interface KakaoMapInterface {
    mapCenter: { 
        lat: number 
        lng: number
    };
}

const KakaoMap: React.FC<KakaoMapInterface> = ({mapCenter}) => {
    const { loading, error } = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    return (
        <Map
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            style={{ height: '150px' }}
            level={5}
        >
            <MapMarker position={{ lat: mapCenter.lat, lng: mapCenter.lng }} />
            <ZoomControl position={'TOPLEFT'} />
        </Map>
    )
}

export default KakaoMap