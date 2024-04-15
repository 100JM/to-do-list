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
        className: 'color-wb',
        colorName: '워터 블루'
    },
    {
        className: 'color-mg',
        colorName: '민트 그린'
    },
    {
        className: 'color-cr',
        colorName: '코랄'
    },
    {
        className: 'color-lv',
        colorName: '라벤더'
    },
    {
        className: 'color-gr',
        colorName: '골든 로드'
    },
    {
        className: 'color-sg',
        colorName: '슬레이트 그레이'
    },
    {
        className: 'color-sm',
        colorName: '살몬'
    },
    {
        className: 'color-tl',
        colorName: '틸 그린'
    },
    {
        className: 'color-ig',
        colorName: '인디고'
    },
    {
        className: 'color-cs',
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
                        className={`w-full p-2 pl-4 border-b flex justify-start items-center ${color.className}`}
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