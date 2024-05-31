import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

interface KakaoAddrSearchFormInterface {
    handleAddrComplete: (value: any) => void
    handleShowAddrSearch: (isShow: boolean) => void;
}

const KakaoAddrSearchForm: React.FC<KakaoAddrSearchFormInterface> = ({handleAddrComplete, handleShowAddrSearch}) => {
    return (
        <DaumPostcodeEmbed onComplete={handleAddrComplete} onClose={() => {handleShowAddrSearch(false)}}/>
    )
}

export default KakaoAddrSearchForm;