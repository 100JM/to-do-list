import React, { useState, useRef } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faMapLocationDot, faLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface OverseaAddrSearchFormInterface {
    selectedColor: string;
    handleSetOverseaAddr: (address: any) => void;
}

const OverseaAddrSearchForm: React.FC<OverseaAddrSearchFormInterface> = ({selectedColor, handleSetOverseaAddr}) => {
    const [searchedAddr, setSearchedAddr] = useState<Array<any>>([]);
    const [isSearchEnd, setIsSearchEnd] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const nominatimAddrSearch = async () => {
        setSearchedAddr([]);
        setIsSearchEnd(false);

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: (searchInputRef.current as HTMLInputElement).value,
                    format: 'json',
                    addressdetails: 1,
                    limit: 10
                }
            });

            setSearchedAddr(response.data);

        } catch (error) {
            console.error('Error fetching data from Nominatim:', error);
        } finally {
            setIsSearchEnd(true);
        }
    };

    const handleOnEnter = (key:any) => {
        if(key.key === 'Enter' || key.keyCode === 13) {
            nominatimAddrSearch();
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
                <button className="w-6" onClick={nominatimAddrSearch}>
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
                            <li key={l.place_id} className="p-2 border-b cursor-pointer hover:bg-stone-100" onClick={() => handleSetOverseaAddr(l)}>
                                <p className="text-xs pb-1">{l.display_name}</p>
                                <p className="text-sm"><FontAwesomeIcon icon={faLocationDot as IconProp} style={{ color: selectedColor }} />{` ${l.name}`}</p>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    );
};

export default OverseaAddrSearchForm;