import { useEffect, useRef, useState } from 'react';

import DialogContentsDiv from './DialogContentsDiv';
import TaskColor from './TaskColor';
import TaskColorButtons from './TaskColorButtons';
import TaskList from './TaskList';

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
    selectedDateEventList: Array<any>;
    getSelectedEventInfo: (id: string) => void;
    setTaskInfo: (name: string, value: string | boolean) => void;
}

interface OpenColorBarInterface {
    open: boolean,
    selectedColor: string,
    colorName: string,
}

interface ToDoValueRefs {
    [key: string]: HTMLElement | null;
}

const koLocale: string = dayjs.locale('ko');

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate, addNewTodoList, selectedDateEventList, getSelectedEventInfo, setTaskInfo }) => {
    // 수정 기능 & 뒤로가기? -> state 변경이 안돼서 초기화가 안되는 오류 발생 (handleIsAllday) -> selectedDate와 selectedEventDate로 상태 분기?
    
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
    console.log(isAddArea);
    useEffect(() => {
        setOpenColorBar(prevState => ({
            ...prevState,
            selectedColor: selectedDate.color,
            colorName: selectedDate.colorName
        }));

        setIsAllday(selectedDate.allDay);

        if (selectedDate.id && !selectedDate.allDay) {
            setSelectedTime((prevTime) => {
                return {
                    ...prevTime,
                    startTime: selectedDate.start.split('T')[1],
                    endTime: selectedDate.end.split('T')[1]
                }
            })
        }

    }, [selectedDate.id]);

    const handleIsAllday = () => {
        setIsAllday((prev) => !prev);
    }

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

    // const handleStartDate = (date: Dayjs | null) => {
    //     if (date) {
    //         let formattedStartDate: string = '';

    //         formattedStartDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);

    //         setStartDate(formattedStartDate);
    //     }
    // };

    const handletDate = (name: string, date: Dayjs | null) => {
        if (date) {
            let formattedEndDate: string = '';

            formattedEndDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);

            setTaskInfo(name, formattedEndDate);
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
    }

    const handleAddArea = () => {
        setIsAddArea(!isAddArea);
    }

    const handleUpdateTask = (taskId: string) => {
        setIsAddArea(!isAddArea);

        getSelectedEventInfo(taskId);
    }

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
                        <span className="text-sm font-semibold" style={{ color: "#1a252f" }}>{dayjs(selectedDate.start).format('YYYY년 MM월 DD일 dddd')}</span>
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
                            <button className="p-2">
                                <FontAwesomeIcon icon={faTrash as IconProp} style={{ color: openColorBar.selectedColor }} />
                            </button>
                            {selectedDate.id ?
                                <button className="p-2">
                                    <FontAwesomeIcon icon={faPenToSquare as IconProp} style={{ color: openColorBar.selectedColor }} />
                                </button>
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
                                <input type="text" placeholder="제목" name="title" className="outline-none w-full px-1" defaultValue={selectedDate.title} ref={(e) => { toDoValueRef.current['title'] = e }} />
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
                                                value={dayjs(selectedDate.start)}
                                                onChange={(date) => { handletDate('start', date) }}
                                                className="w-22 sm:w-48"
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                shouldDisableDate={day => {
                                                    return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isAfter(
                                                        (isAllday ? (selectedDate.start.split('T')[0] === selectedDate.end.split('T')[0] ? dayjs(selectedDate.end) : dayjs(selectedDate.end).add(-1, 'day')) : selectedDate.end)
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
                                                    return dayjs(`${dayjs(selectedDate.start).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isAfter(dayjs(`${dayjs(selectedDate.end).format('YYYY-MM-DD')}T${selectedTime.endTime}`));
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
                                                defaultValue={(selectedDate.allDay ? (selectedDate.start.split('T')[0] === selectedDate.end.split('T')[0] ? dayjs(selectedDate.end) : dayjs(selectedDate.end).add(-1, 'day')) : dayjs(selectedDate.end))}
                                                onChange={(date) => { handletDate('end', date) }}
                                                className="w-22 sm:w-48"
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                shouldDisableDate={day => {
                                                    return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isBefore(
                                                        // (selectedDate.allDay ? (selectedDate.start.split('T')[0] === selectedDate.end.split('T')[0] ?  dayjs(selectedDate.start).add(-1, 'day') : dayjs(selectedDate.start)) : dayjs(selectedDate.start).add(-1, 'day'))
                                                        dayjs(selectedDate.start).format(`YYYY-MM-DD`)
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
                                                    return dayjs(`${dayjs(selectedDate.end).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isBefore(dayjs(`${dayjs(selectedDate.start).format('YYYY-MM-DD')}T${selectedTime.startTime}`));
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
                                        defaultChecked={selectedDate.important}
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
                                <textarea placeholder="일정내용" className="outline-none w-full px-1 min-h-20" ref={(e) => { toDoValueRef.current['description'] = e }} name="description" value={selectedDate.description} onChange={(e) => { setTaskInfo(e.target.name, e.target.value) }}></textarea>
                            </DialogContentsDiv>
                        </div>
                    </DialogContent>
                </>
            }
        </Dialog>
    );
}

export default TodoDialog;