import { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faMapLocationDot, faLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface GoogleAddrSearchFormInterface {
    selectedColor: string
    handlePlaceClickEvt: (address: any) => void
}

const GoogleAddrSearchForm: React.FC<GoogleAddrSearchFormInterface> = ({selectedColor, handlePlaceClickEvt}) => {
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [isZeroResult, setIsZeroResult] = useState<boolean>(false);

    const searchPlaces = (query: string) => {
        if(!query) {
            setPlaces([]);
            return;
        }

        const request = {
            query: query
        };
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        service.textSearch(request, (results, status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPlaces(results);
            }else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                setIsZeroResult(true);
            }
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(isZeroResult) {
            setIsZeroResult(false);
        }

        setSearchValue(event.target.value);
        searchPlaces(event.target.value);
    };

    const handleButtonClick = () => {
        searchPlaces(searchValue);
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
                    value={searchValue}
                    onChange={handleInputChange}
                />
                <button className="w-6" onClick={handleButtonClick}>
                    <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} style={{ color: "rgb(166 167 169)" }} />
                </button>
            </div>
            <div className="w-full my-2 overflow-y-auto" style={{ height: "calc(100% - 3.5rem)" }}>
                {
                    isZeroResult ? <div className="w-full h-full flex justify-center items-center">검색 결과가 없습니다.</div> :
                    places.length === 0 ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <FontAwesomeIcon icon={faMapLocationDot as IconProp} style={{ color: "rgb(220 223 228)", fontSize: "40px" }} />
                        </div>
                    ) : (
                        <ul>
                            {places.map((place) => (
                                <li key={place.place_id} className="p-2 border-b cursor-pointer hover:bg-stone-100" onClick={() => handlePlaceClickEvt(place)}>
                                    <p className="text-xs pb-1">{place.formatted_address}</p>
                                    <p className="text-sm"><FontAwesomeIcon icon={faLocationDot as IconProp} style={{color: selectedColor}} />{` ${place.name}`}</p>
                                </li>
                            ))}
                        </ul>
                    )
                }
            </div>
        </div>
    );
}

export default GoogleAddrSearchForm;