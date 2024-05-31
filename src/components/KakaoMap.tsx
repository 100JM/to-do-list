import { Map } from 'react-kakao-maps-sdk'

const KakaoMap: React.FC = () => {
    return (
        <Map
            center={{ lat: 33.5563, lng: 126.79581 }}   // 지도의 중심 좌표
            style={{ height: '120px' }} // 지도 크기
            level={5}                                   // 지도 확대 레벨
        >
        </Map>
    )
}

export default KakaoMap