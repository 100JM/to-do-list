interface TaskListInterface {
    taskData:Array<any>,
    handleUpdateTask:(taskId:string) => void;
}

const TaskList: React.FC<TaskListInterface> = ({taskData, handleUpdateTask}) => {
    
    return (
        <div className="w-full min-h-80 overflow-y-auto">
            <ul>
                {taskData.map((t) => (
                    <li key={t.id} className="p-1 rounded mb-2 text-white" style={{backgroundColor: t.backgroundColor}}>
                        <button className="w-full text-start overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => handleUpdateTask(t.id)}>
                            {t.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;

