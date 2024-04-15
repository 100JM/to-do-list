import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPalette } from "@fortawesome/free-solid-svg-icons"

interface ColorListInterFace {
    className:string,
    colorName:string
}

// color 값으로 변경
const COLOR_LIST: ColorListInterFace[] = [
    {
        className: '#3788d8',
        colorName: '워터 블루'
    },
    {
        className: '#73e473',
        colorName: '민트 그린'
    },
    {
        className: '#FF7F50',
        colorName: '코랄'
    },
    {
        className: '#a0a0e8',
        colorName: '라벤더'
    },
    {
        className: '#DAA520',
        colorName: '골든 로드'
    },
    {
        className: '#708090',
        colorName: '슬레이트 그레이'
    },
    {
        className: '#FA8072',
        colorName: '살몬'
    },
    {
        className: '#008080',
        colorName: '틸 그린'
    },
    {
        className: '#4B0082',
        colorName: '인디고'
    },
    {
        className: '#DC143C',
        colorName: '크림슨'
    },
]

interface TaskColorButtonsInterface {
    onClick: (newOpen:boolean, className:string, colorName:string) => void,
    selectedColor: string
}

const TaskColorButtons: React.FC<TaskColorButtonsInterface> = ({onClick, selectedColor}) => {
    return (
        <>
            {COLOR_LIST.map((color) => (
                <div key={color.className} className={`hover:bg-slate-200 ${color.className === selectedColor ? 'bg-slate-200' : ''}`}>
                    <button 
                        className="w-full p-2 pl-4 border-b flex justify-start items-center"
                        style={{color: color.className}}
                        onClick={() => onClick(false, color.className, color.colorName)}
                    >
                        <FontAwesomeIcon icon={faPalette as IconProp} />
                        <span className="ml-2">{color.colorName}</span>
                    </button>
                </div>
            ))}
        </>
    );
}

export default TaskColorButtons;