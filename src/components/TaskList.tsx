import dayjs from "dayjs";

interface TaskListInterface {
    taskData:Array<any>,
}

const TaskList: React.FC<TaskListInterface> = ({taskData}) => {
    
    return (
        <div className="w-full min-h-80 overflow-auto">
            <ul>
                {taskData.map((t) => (
                    <li key={t.id} className="p-1 rounded mb-2 text-white" style={{backgroundColor: t.backgroundColor}}>
                        <button className="w-full text-start">
                            {/* {`${t.title} (${(t.allDay) ? t.startStr : dayjs(t.startStr).format('YYYY-MM-DD') + '-' + dayjs(t.endStr).format('YYYY-MM-DD')})`} */
                                t.title
                            }
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;

