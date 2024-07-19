import React, { useState, useRef } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faMapLocationDot, faLocationDot, faMagnifyingGlass, faL } from '@fortawesome/free-solid-svg-icons';

interface KakaoAddrSearchFormInterface {
    selectedColor: string;
    handleSetKoreaAddr: (address: any) => void;
}

const KakaoAddrSearchForm: React.FC<KakaoAddrSearchFormInterface> = ({selectedColor, handleSetKoreaAddr}) => {
    const [searchedAddr, setSearchedAddr] = useState<Array<any>>([]);
    const [isSearchEnd, setIsSearchEnd] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const searchAddr = async () => {
        setSearchedAddr([]);
        setIsSearchEnd(false);

        if(!(searchInputRef.current as HTMLInputElement).value) {
            return;
        }

        try {
            const keywordResponse = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
                params: {
                    query: (searchInputRef.current as HTMLInputElement).value,
                },
                headers: {
                    Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
                }
            });

            setSearchedAddr(keywordResponse.data.documents);
            setIsSearchEnd(keywordResponse.data.meta.is_end);

        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const handleOnEnter = (key:any) => {
        if(key.key === 'Enter' || key.keyCode === 13) {
            searchAddr();
        }
    };

    return (
        <div className="w-full h-80 p-2">
            <div className="w-full h-10 border rounded flex items-center">
                <input
                    type="text"
                    placeholder="장소를 검색하세요."
                    style={{
                        padding: "4px",
                        width: "calc(100% - 28px)",
                        outline: "none"
                    }}
                    ref={searchInputRef}
                    onKeyUp={(e) => handleOnEnter(e)}
                />
                <button className="w-6" onClick={searchAddr}>
                    <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} style={{ color: "rgb(166 167 169)" }} />
                </button>
            </div>
            <div className="w-full my-2 overflow-y-auto" style={{ height: "calc(100% - 3.5rem)" }}>
                {
                    searchedAddr.length === 0 && !isSearchEnd &&
                    <div className="w-full h-full flex justify-center items-center">
                        <FontAwesomeIcon icon={faMapLocationDot as IconProp} style={{ color: "rgb(220 223 228)", fontSize: "40px" }} />
                    </div>
                }
                {
                    searchedAddr.length === 0 && isSearchEnd &&
                    <div className="w-full h-full flex justify-center items-center">검색 결과가 없습니다.</div>
                }
                {
                    searchedAddr.length > 0 &&
                    <ul>
                        {searchedAddr.map((l) => (
                            <li key={l.id} className="p-2 border-b cursor-pointer hover:bg-stone-100" onClick={() => handleSetKoreaAddr(l)}>
                                <p className="text-xs pb-1">{l.address_name}</p>
                                <p className="text-xs pb-1">{l.road_address_name}</p>
                                <p className="text-sm"><FontAwesomeIcon icon={faLocationDot as IconProp} style={{ color: selectedColor }} />{` ${l.place_name}`}</p>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    )
}

export default KakaoAddrSearchForm;