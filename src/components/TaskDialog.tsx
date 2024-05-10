import { useEffect, useRef, useState } from 'react';

import DialogContentsDiv from './DialogContentsDiv';
import TaskColor from './TaskColor';
import TaskColorButtons from './TaskColorButtons';
import TaskList from './TaskList';
import CustomAlert from './CustomAlert';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';

import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import 'dayjs/locale/ko';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faClockRotateLeft, faThumbTack, faCircleXmark, faCirclePlus, faTrash, faCircleCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

interface TodoDialogInterface {
    isOpen: boolean;
    closeTodoModal: () => void;
    selectedDate: {
        id: string,
        title: string,
        allDay: boolean,
        start: string,
        end: string,
        color: string,
        colorName: string,
        description: string,
        important: boolean,
        display: string,
    };
    addNewTodoList: (newToDo: object) => void;
    updateTaskInfo: (taskInfo:object) => void;
    deleteTaskInfo: (taskId:string) => void;
    selectedDateEventList: Array<any>;
    getSelectedEventInfo: (id: string) => void;
    setTaskInfo: (name: string, value: string | boolean) => void;
    selectedDateEventInfo: {
        id: string,
        title: string,
        allDay: boolean,
        start: string,
        end: string,
        color: string,
        colorName: string,
        description: string,
        important: boolean,
        display: string,
    };
    setSelectedEventInfoDefault: () => void;
    handleShowAlert: (isShow:boolean, alertText:string, alertType: 'error' | 'warning' | 'info' | 'success') => void;
    showAlert: {
        isShow: boolean,
        alertText: string,
        alertType: 'error' | 'warning' | 'info' | 'success'
    };
}

interface OpenColorBarInterface {
    open: boolean,
    selectedColor: string,
    colorName: string,
}

interface ToDoValueRefs {
    [key: string]: HTMLElement | null;
}

interface DateData {
    id: string,
    title: string,
    allDay: boolean,
    start: string,
    end: string,
    color: string,
    colorName: string,
    description: string,
    important: boolean,
    display: string,
}

const koLocale: string = dayjs.locale('ko');

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate, addNewTodoList, updateTaskInfo, deleteTaskInfo, selectedDateEventList, getSelectedEventInfo, setTaskInfo, selectedDateEventInfo, setSelectedEventInfoDefault, handleShowAlert, showAlert }) => {
    
    const defaultStartDateTime = dayjs().set('hour', 9).set('minute', 0).startOf('minute').format('HH:mm');
    const defaultEndDateTime = dayjs().set('hour', 18).set('minute', 0).startOf('minute').format('HH:mm');

    const [selectedTime, setSelectedTime] = useState<{ startTime: string, endTime: string }>({
        startTime: defaultStartDateTime,
        endTime: defaultEndDateTime
    });

    const [isAddArea, setIsAddArea] = useState<boolean>(false);
    const [isAllday, setIsAllday] = useState<boolean>(true);
    const [openColorBar, setOpenColorBar] = useState<OpenColorBarInterface>({
        open: false,
        selectedColor: '#3788d8',
        colorName: '워터 블루'
    });

    const timeRef = useRef<HTMLDivElement | null>(null);
    const toDoValueRef = useRef<ToDoValueRefs>({});
    let dateData: DateData = {
        id: (selectedDateEventInfo.id ? selectedDateEventInfo.id : selectedDate.id),
        title: (selectedDateEventInfo.id ? selectedDateEventInfo.title : selectedDate.title),
        allDay: (selectedDateEventInfo.id ? selectedDateEventInfo.allDay : selectedDate.allDay),
        start: (selectedDateEventInfo.id ? selectedDateEventInfo.start : selectedDate.start),
        end: (selectedDateEventInfo.id ? selectedDateEventInfo.end : selectedDate.end),
        color: (selectedDateEventInfo.id ? selectedDateEventInfo.color : selectedDate.color),
        colorName: (selectedDateEventInfo.id ? selectedDateEventInfo.colorName : selectedDate.colorName),
        description: (selectedDateEventInfo.id ? selectedDateEventInfo.description : selectedDate.description),
        important: (selectedDateEventInfo.id ? selectedDateEventInfo.important : selectedDate.important),
        display: 'block'
    };

    useEffect(() => {
        setOpenColorBar(prevState => ({
            ...prevState,
            selectedColor: (selectedDateEventInfo.id ? selectedDateEventInfo.color : selectedDate.color),
            colorName: (selectedDateEventInfo.id ? selectedDateEventInfo.colorName : selectedDate.colorName)
        }));

        if (selectedDateEventInfo.id) {
            setIsAllday(selectedDateEventInfo.allDay);
        } else {
            setIsAllday(selectedDate.allDay);
        }

        if (selectedDateEventInfo.id && !selectedDateEventInfo.allDay) {
            setSelectedTime((prevTime) => {
                return {
                    ...prevTime,
                    startTime: selectedDateEventInfo.start.split('T')[1],
                    endTime: selectedDateEventInfo.end.split('T')[1]
                }
            })
        }
    }, [selectedDateEventInfo.id]);

    const handleIsAllday = () => {
        setIsAllday((prev) => !prev);
    };

    const handleDraw = (newOpen: boolean) => {
        setOpenColorBar((prevState) => {
            return {
                ...prevState,
                open: newOpen
            }
        });
    };

    const handleTaskColor = (newOpen: boolean, className: string, colorName: string) => {
        setOpenColorBar((prevState) => {
            return {
                ...prevState,
                open: newOpen,
                selectedColor: className,
                colorName: colorName
            }
        })
    };

    const handletDate = (name: string, date: Dayjs | null) => {
        if (date) {
            let formattedDate: string = '';

            formattedDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);

            setTaskInfo(name, formattedDate);
        }
    };

    const handleStartTime = (date: Dayjs | null) => {
        if (date) {
            setSelectedTime((prevTime) => {
                return {
                    ...prevTime,
                    startTime: dayjs(date as Dayjs).format('HH:mm')
                }
            })
        }
    };

    const handleEndTime = (date: Dayjs | null) => {
        if (date) {
            setSelectedTime((prevTime) => {
                return {
                    ...prevTime,
                    endTime: dayjs(date as Dayjs).format('HH:mm')
                }
            })
        }
    };

    const submitTask = () => {
        const checkTimeInput = timeRef.current?.querySelector('.MuiInputBase-root');

        if (!(toDoValueRef.current.title as HTMLInputElement).value) {
            handleShowAlert(true, '제목을 입력해주세요.', 'warning');
            (toDoValueRef.current.title as HTMLInputElement).focus();
            return;
        }

        if (checkTimeInput) {
            if (checkTimeInput.classList.contains('Mui-error')) {
                handleShowAlert(true, '시작시간이 종료시간보다 이후거나 종료시간이 시작시간보다 이전일 수 없습니다.', 'error');
                return;
            }
        }

        let selectStartDateValue: string;
        let selectEndDateValue: string;

        if (isAllday) {
            selectStartDateValue = selectedDate.start;
            selectEndDateValue = dayjs(dayjs(selectedDate.end).add(1, 'day')).format('YYYY-MM-DD');
        } else {
            selectStartDateValue = `${selectedDate.start}T${selectedTime.startTime}`;
            selectEndDateValue = `${selectedDate.end}T${selectedTime.endTime}`;
        }

        const newToDo: object = {
            id: Math.random().toString(),
            title: (toDoValueRef.current.title as HTMLInputElement).value,
            allDay: (toDoValueRef.current.allDay as HTMLInputElement).checked,
            start: selectStartDateValue,
            end: selectEndDateValue,
            color: openColorBar.selectedColor,
            colorName: openColorBar.colorName,
            description: (toDoValueRef.current.description as HTMLTextAreaElement).value,
            important: (toDoValueRef.current.important as HTMLInputElement).checked,
            display: 'block'
        };

        addNewTodoList(newToDo);

        closeTodoModal();

        handleShowAlert(true, '일정이 등록되었습니다.', 'success');
    };

    const updateTask = () => {
        const checkTimeInput = timeRef.current?.querySelector('.MuiInputBase-root');
        
        if (!(toDoValueRef.current.title as HTMLInputElement).value) {
            alert('제목을 입력해주세요.');
            (toDoValueRef.current.title as HTMLInputElement).focus();
            return;
        }

        if (checkTimeInput) {
            if (checkTimeInput.classList.contains('Mui-error')) {
                alert('시작시간이 종료시간보다 이후거나 종료시간이 시작시간보다 이전일 수 없습니다.');
                return;
            }
        }
        
        let updatedStartDateValue: string;
        let updatedEndDateValue: string;

        if (isAllday) {
            updatedStartDateValue = selectedDateEventInfo.start.split('T')[0];
            updatedEndDateValue = dayjs(dayjs(selectedDateEventInfo.end.split('T')[0]).add(1, 'day')).format('YYYY-MM-DD'); // 여기 수정해야함 계속 1일씩 늘어남
        } else {
            updatedStartDateValue = `${selectedDateEventInfo.start.split('T')[0]}T${selectedTime.startTime}`;
            updatedEndDateValue = `${selectedDateEventInfo.end.split('T')[0]}T${selectedTime.endTime}`;
        }

        const updatedToDo: object = {
            id: selectedDateEventInfo.id,
            title: (toDoValueRef.current.title as HTMLInputElement).value,
            allDay: (toDoValueRef.current.allDay as HTMLInputElement).checked,
            start: updatedStartDateValue,
            end: updatedEndDateValue,
            color: openColorBar.selectedColor,
            colorName: openColorBar.colorName,
            description: (toDoValueRef.current.description as HTMLTextAreaElement).value,
            important: (toDoValueRef.current.important as HTMLInputElement).checked,
            display: 'block'
        };

        updateTaskInfo(updatedToDo);
        setSelectedEventInfoDefault();

        closeTodoModal();

        handleShowAlert(true, '일정이 수정되었습니다.', 'success');
    };

    const deleteTask = (id:string) => {
        if(confirm('해당 일정이 완전히 삭제됩니다.')) {
            deleteTaskInfo(id);

            closeTodoModal();
            
            handleShowAlert(true, '일정이 삭제되었습니다.', 'success');
        }else {
            return;
        }
    }

    const handleAddArea = () => {
        setIsAddArea(!isAddArea);

        setSelectedEventInfoDefault();
    };

    const handleUpdateTask = (taskId: string) => {
        setIsAddArea(!isAddArea);

        getSelectedEventInfo(taskId);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeTodoModal}
            maxWidth="md"
            fullWidth={true}
        >
            {!isAddArea &&
                <>
                    <DialogTitle className="flex justify-between items-center">
                        <span className="text-sm font-semibold" style={{ color: "#1a252f" }}>{dayjs(selectedDate.start).format('YYYY년 MM월 DD일 dddd')}</span> {/* 이부분도 수정해야함 날짜 변경시 같이 변경됨 별개의 state를 둬야할듯?*/}
                        <div>
                            <button type="button" className="p-1" style={{ color: "#2c3e50" }} onClick={closeTodoModal}>
                                <FontAwesomeIcon icon={faCircleXmark as IconProp} />
                            </button>
                            <button type="button" className="p-1" style={{ color: "#2c3e50" }} onClick={handleAddArea}>
                                <FontAwesomeIcon icon={faCirclePlus as IconProp} />
                            </button>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="text-gray-700 mb-4">
                            <DialogContentsDiv>
                                {!(selectedDateEventList.length > 0) &&
                                    <div className="flex items-center justify-center min-h-80">
                                        <span className="text-slate-500">등록된 일정이 없습니다.</span>
                                    </div>
                                }
                                {(selectedDateEventList.length > 0) && <TaskList taskData={selectedDateEventList} handleUpdateTask={handleUpdateTask} />}
                            </DialogContentsDiv>
                        </div>
                    </DialogContent>
                </>
            }
            {isAddArea &&
                <>
                    <DialogTitle className="flex justify-between items-center">
                        <IconButton aria-label="delete" size="large" onClick={handleAddArea} sx={{ color: openColorBar.selectedColor, padding: "8px" }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <div className='p-1'>

                            {selectedDateEventInfo.id ?
                                <>
                                    <button className="p-2">
                                        <FontAwesomeIcon icon={faTrash as IconProp} style={{ color: openColorBar.selectedColor }} onClick={() => deleteTask(selectedDateEventInfo.id)}/>
                                    </button>
                                    <button className="p-2">
                                        <FontAwesomeIcon icon={faPenToSquare as IconProp} style={{ color: openColorBar.selectedColor }} onClick={updateTask}/>
                                    </button>
                                </>
                                :
                                <button className="p-2">
                                    <FontAwesomeIcon icon={faCircleCheck as IconProp} style={{ color: openColorBar.selectedColor }} onClick={submitTask} />
                                </button>
                            }
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="text-gray-700 mb-4">
                            <DialogContentsDiv>
                                <input type="text" placeholder="제목" name="title" className="outline-none w-full px-1" defaultValue={dateData.title} ref={(e) => { toDoValueRef.current['title'] = e }} />
                            </DialogContentsDiv>
                            <DialogContentsDiv>
                                <div className="flex justify-between items-center my-1 px-1">
                                    <div>
                                        <FontAwesomeIcon icon={faClockRotateLeft as IconProp} style={{ color: openColorBar.selectedColor }} />
                                        <span className="ml-2">하루종일</span>
                                    </div>
                                    <Switch
                                        color="primary"
                                        checked={isAllday}
                                        onChange={handleIsAllday}
                                        sx={{
                                            "& .MuiSwitch-thumb": { backgroundColor: openColorBar.selectedColor },
                                            "& .MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                            "& .Mui-checked+.MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                        }}
                                        inputRef={(e) => { toDoValueRef.current['allDay'] = e }}
                                    />
                                </div>
                                <div className="flex justify-between items-center my-3 px-1">
                                    <div>
                                        <span className="ml-5-5">시작일</span>
                                    </div>
                                    <div className="flex items-center">
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale}>
                                            <DatePicker
                                                value={dayjs(dateData.start)}
                                                onChange={(date) => { handletDate('start', date) }}
                                                className="w-22 sm:w-48"
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                shouldDisableDate={day => {
                                                    return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isAfter(
                                                        (isAllday ? (dateData.start.split('T')[0] === dateData.end.split('T')[0] ? dayjs(dateData.end) : dayjs(dateData.end).add(-1, 'day')) : dateData.end)
                                                    );
                                                }}
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" }, // width - 610 -> media
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                            />
                                            {!isAllday && <TimePicker
                                                ref={timeRef}
                                                className="w-22 sm:w-48 custom-input"
                                                format="H:mm:A"
                                                value={dayjs(selectedTime.startTime, 'HH:mm')}
                                                onChange={(date) => { handleStartTime(date) }}
                                                shouldDisableTime={time => {
                                                    return dayjs(`${dayjs(dateData.start).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isAfter(dayjs(`${dayjs(dateData.end).format('YYYY-MM-DD')}T${selectedTime.endTime}`));
                                                }}
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" },
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                            />}
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center my-3 px-1">
                                    <div>
                                        <span className="ml-5-5">종료일</span>
                                    </div>
                                    <div className="flex items-center">
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale}>
                                            <DatePicker
                                                defaultValue={(dateData.allDay ? (dateData.start.split('T')[0] === dateData.end.split('T')[0] ? dayjs(dateData.end) : dayjs(dateData.end).add(-1, 'day')) : dayjs(dateData.end))}
                                                onChange={(date) => { handletDate('end', date) }}
                                                className="w-22 sm:w-48"
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                shouldDisableDate={day => {
                                                    return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isBefore(
                                                        // (selectedDate.allDay ? (selectedDate.start.split('T')[0] === selectedDate.end.split('T')[0] ?  dayjs(selectedDate.start).add(-1, 'day') : dayjs(selectedDate.start)) : dayjs(selectedDate.start).add(-1, 'day'))
                                                        dayjs(dateData.start).format(`YYYY-MM-DD`)
                                                    );
                                                }}
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" },
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                            />
                                            {!isAllday && <TimePicker
                                                className="w-22 sm:w-48 custom-input"
                                                format="H:mm:A"
                                                value={dayjs(selectedTime.endTime, 'HH:mm')}
                                                onChange={(date) => { handleEndTime(date) }}
                                                shouldDisableTime={time => {
                                                    return dayjs(`${dayjs(dateData.end).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isBefore(dayjs(`${dayjs(dateData.start).format('YYYY-MM-DD')}T${selectedTime.startTime}`));
                                                }}
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" },
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                            />}
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </DialogContentsDiv>
                            <DialogContentsDiv>
                                <div className="flex justify-between items-center my-1 px-1">
                                    <div>
                                        <FontAwesomeIcon icon={faThumbTack as IconProp} style={{ color: openColorBar.selectedColor }} />
                                        <span className="ml-2">중요일정</span>
                                    </div>
                                    <Switch
                                        color="primary"
                                        defaultChecked={dateData.important}
                                        sx={{
                                            "& .MuiSwitch-thumb": { backgroundColor: openColorBar.selectedColor },
                                            "& .MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                            "& .Mui-checked+.MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                        }}
                                        inputRef={(e) => { toDoValueRef.current['important'] = e }}
                                    />
                                </div>
                            </DialogContentsDiv>
                            <DialogContentsDiv>
                                <TaskColor handleDraw={handleDraw} selectedColor={openColorBar.selectedColor} colorName={openColorBar.colorName} />
                                <Drawer
                                    open={openColorBar.open}
                                    onClose={() => handleDraw(false)}
                                    anchor={"bottom"}
                                    style={{ zIndex: "9999" }}
                                    sx={{ "& .MuiDrawer-paperAnchorBottom": { maxHeight: "50%" } }}
                                >
                                    <TaskColorButtons onClick={handleTaskColor} selectedColor={openColorBar.selectedColor} />
                                </Drawer>
                            </DialogContentsDiv>
                            <DialogContentsDiv>
                                <textarea placeholder="일정내용" className="outline-none w-full px-1 min-h-20" ref={(e) => { toDoValueRef.current['description'] = e }} name="description" value={dateData.description} onChange={(e) => { setTaskInfo(e.target.name, e.target.value) }}></textarea>
                            </DialogContentsDiv>
                        </div>
                    </DialogContent>
                </>
            }
            <CustomAlert showAlert={showAlert} handleShowAlert={handleShowAlert}/>
        </Dialog>
    );
}

export default TodoDialog;