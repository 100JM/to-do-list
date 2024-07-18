import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../store/store';
import { dateAction } from '../store/dateSlice';
import { modalAction } from "../store/modalSlice";

const TaskList: React.FC = () => {
    const selectedDateEventList = useSelector((state:RootState) => state.date.selectedDateEventList);
    const dispatch = useDispatch();

    const handleUpdateTodoArea = (id:string, e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(modalAction.handleAddArea(true));
        dispatch(dateAction.getSelectedEventInfo(id));
    };

    return (
        <div className="w-full min-h-80 overflow-y-auto">
            <ul>
                {selectedDateEventList.map((t) => (
                    <li key={t.id} className="p-1 rounded mb-2 text-white" style={{backgroundColor: t.backgroundColor}}>
                        <button className="w-full text-start overflow-hidden text-ellipsis whitespace-nowrap" onClick={(e) => handleUpdateTodoArea(t.id, e)}>
                            {t.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;