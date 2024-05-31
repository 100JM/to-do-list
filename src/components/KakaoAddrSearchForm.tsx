import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

interface KakaoAddrSearchFormInterface {

}

const KakaoAddrSearchForm: React.FC<KakaoAddrSearchFormInterface> = () => {
    return (
        // <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: "9999" }}>
            <DaumPostcodeEmbed />
        // </div>
    )
}

export default KakaoAddrSearchForm;