import { useEffect, useRef, useState } from 'react';

import DialogContentsDiv from './DialogContentsDiv';
import TaskColor from './TaskColor';
import TaskColorButtons from './TaskColorButtons';
import TaskList from './TaskList';
import CustomAlert from './CustomAlert';
import KakaoMap from './KakaoMap';
import KakaoAddrSearchForm from './KakaoAddrSearchForm';
import GoogleMaps from './GoogleMaps';
import GoogleAddrSearchForm from './GoogleAddrSearchForm';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
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
import { faClockRotateLeft, faThumbTack, faCircleXmark, faCirclePlus, faTrash, faCircleCheck, faPenToSquare, faMapLocationDot, faMagnifyingGlass, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

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
        lat: number,
        lng: number,
        locationName: string
    };
    addNewTodoList: (newToDo: object) => void;
    updateTaskInfo: (taskInfo: object) => void;
    deleteTaskInfo: (taskId: string) => void;
    selectedDateEventList: Array<any>;
    getSelectedEventInfo: (id: string) => void;
    setTaskInfo: (name: string, value: string | boolean, isUpdate: boolean) => void;
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
        lat: number,
        lng: number,
        locationName: string
    };
    setSelectedEventInfoDefault: () => void;
    handleShowAlert: (isShow: boolean, alertText: string, alertType: 'error' | 'warning' | 'info' | 'success') => void;
    showAlert: {
        isShow: boolean,
        alertText: string,
        alertType: 'error' | 'warning' | 'info' | 'success'
    };
    isAddArea: boolean;
    setIsAddArea: (show: boolean) => void;
    showSearchForm: boolean;
    isTodoButton: boolean;
    bottomMenu: string;
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
    lat: number,
    lng: number,
    locationName: string
}

const koLocale: string = dayjs.locale('ko');

const TodoDialog: React.FC<TodoDialogInterface> = ({
    isOpen,
    closeTodoModal,
    selectedDate,
    addNewTodoList,
    updateTaskInfo,
    deleteTaskInfo,
    selectedDateEventList,
    getSelectedEventInfo,
    setTaskInfo,
    selectedDateEventInfo,
    setSelectedEventInfoDefault,
    handleShowAlert,
    showAlert,
    isAddArea,
    setIsAddArea,
    showSearchForm,
    isTodoButton,
    bottomMenu,
}) => {

    const defaultStartDateTime = dayjs().set('hour', 9).set('minute', 0).startOf('minute').format('HH:mm');
    const defaultEndDateTime = dayjs().set('hour', 18).set('minute', 0).startOf('minute').format('HH:mm');

    const [selectedTime, setSelectedTime] = useState<{ startTime: string, endTime: string }>({
        startTime: defaultStartDateTime,
        endTime: defaultEndDateTime
    });

    const [showAddrSearch, setShowAddrSearch] = useState<boolean>(false);
    const [isAllday, setIsAllday] = useState<boolean>(true);
    const [openColorBar, setOpenColorBar] = useState<OpenColorBarInterface>({
        open: false,
        selectedColor: '#3788d8',
        colorName: '워터 블루'
    });
    const [dialogDate, setDialogDate] = useState<string>('');
    const [selectedAddr, setSelectedAddr] = useState<any>();
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 37.5665, lng: 126.9780 });

    useEffect(() => {
        setDialogDate(selectedDate.start);
    }, []);

    const dateRef = useRef<HTMLDivElement | null>(null);
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
        display: 'block',
        lat: (selectedDateEventInfo.id ? selectedDateEventInfo.lat : mapCenter.lat),
        lng: (selectedDateEventInfo.id ? selectedDateEventInfo.lng : mapCenter.lng),
        locationName: (selectedDateEventInfo.id ? selectedDateEventInfo.locationName : selectedDate.locationName),
    };

    useEffect(() => {
        setOpenColorBar(prevState => ({
            ...prevState,
            selectedColor: (selectedDateEventInfo.id ? selectedDateEventInfo.color : selectedDate.color),
            colorName: (selectedDateEventInfo.id ? selectedDateEventInfo.colorName : selectedDate.colorName)
        }));

        if (selectedDateEventInfo.id) {
            setIsAllday(selectedDateEventInfo.allDay);
            setMapCenter((prev) => {
                return {
                    ...prev,
                    lat: (selectedDateEventInfo.lat ? selectedDateEventInfo.lat : mapCenter.lat),
                    lng: (selectedDateEventInfo.lng ? selectedDateEventInfo.lng : mapCenter.lng),
                }
            });

            if(selectedDateEventInfo.locationName !== '') {
                setSelectedAddr(selectedDateEventInfo.locationName);
            }
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

    const handleShowAddrSearch = (isShow: boolean) => {
        setShowAddrSearch(isShow);
    };

    const handlePlaceClickEvt = (address: any) => {
        setMapCenter(address.geometry.location.toJSON());
        setSelectedAddr(`${address.name}, ${address.formatted_address}`);
        handleShowAddrSearch(false);
    };

    const handleLocationDefault = () => {
        setSelectedAddr('');
        setMapCenter((prev) => {
            return {
                ...prev,
                lat: 37.5665, 
                lng: 126.9780
            }
        });
    };

    const handleAddrComplete = (value: any) => {
        setSelectedAddr(`${value.name}, ${value.formatted_address}`);

        const geocoder = new kakao.maps.services.Geocoder();

        let callback = function (result: any, status: any) {
            if (status === kakao.maps.services.Status.OK) {
                const newSearch = result[0]
                setMapCenter((prev) => {
                    return {
                        ...prev,
                        lat: newSearch.y,
                        lng: newSearch.x
                    }
                })
            }
        };
        geocoder.addressSearch(`${value.address}`, callback);
    };

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

    const handletDate = (name: string, date: Dayjs | null, isUpdate: boolean) => {
        if (date) {
            let formattedDate: string = '';

            formattedDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);

            setTaskInfo(name, formattedDate, isUpdate);
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
        const checkDateInput = dateRef.current?.classList.contains('date-error');
        const checkTimeInput = timeRef.current?.classList.contains('date-error');


        if (!(toDoValueRef.current.title as HTMLInputElement).value) {
            handleShowAlert(true, '제목을 입력해주세요.', 'warning');
            (toDoValueRef.current.title as HTMLInputElement).focus();
            return;
        }



        if (checkTimeInput || checkDateInput) {
            handleShowAlert(true, '시작일과 종료일이 올바르지 않습니다.', 'error');
            return;
        }

        let selectStartDateValue: string;
        let selectEndDateValue: string;

        if (isAllday) {
            selectStartDateValue = selectedDate.start.split('T')[0];
            selectEndDateValue = dayjs(dayjs(selectedDate.end).add(1, 'day')).format('YYYY-MM-DD');
        } else {
            selectStartDateValue = `${selectedDate.start.split('T')[0]}T${selectedTime.startTime}`;
            selectEndDateValue = `${selectedDate.end.split('T')[0]}T${selectedTime.endTime}`;
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
            display: 'block',
            lat: mapCenter.lat,
            lng: mapCenter.lng,
            locationName: selectedAddr,
        };

        addNewTodoList(newToDo);

        closeTodoModal();

        handleShowAlert(true, '일정이 등록되었습니다.', 'success');
    };

    const updateTask = () => {
        const checkUpdateDateInput = dateRef.current?.classList.contains('date-error');
        const checkUpdateTimeInput = timeRef.current?.classList.contains('date-error');


        if (!(toDoValueRef.current.title as HTMLInputElement).value) {
            handleShowAlert(true, '제목을 입력해주세요.', 'warning');
            (toDoValueRef.current.title as HTMLInputElement).focus();
            return;
        }

        if (checkUpdateDateInput || checkUpdateTimeInput) {
            handleShowAlert(true, '시작일과 종료일이 올바르지 않습니다.', 'error');
            return;
        }

        let updatedStartDateValue: string;
        let updatedEndDateValue: string;

        if (isAllday) {
            updatedStartDateValue = selectedDateEventInfo.start.split('T')[0];
            updatedEndDateValue = dayjs(dayjs((toDoValueRef.current.end as HTMLInputElement).value).add(1, 'day')).format('YYYY-MM-DD');
        } else {
            updatedStartDateValue = `${selectedDateEventInfo.start.split('T')[0]}T${selectedTime.startTime}`;
            updatedEndDateValue = `${(toDoValueRef.current.end as HTMLInputElement).value}T${selectedTime.endTime}`;
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
            display: 'block',
            lat: mapCenter.lat,
            lng: mapCenter.lng,
            locationName: selectedAddr,
        };

        updateTaskInfo(updatedToDo);
        setSelectedEventInfoDefault();

        closeTodoModal();

        handleShowAlert(true, '일정이 수정되었습니다.', 'success');
    };

    const deleteTask = (id: string) => {
        if (confirm('해당 일정이 완전히 삭제됩니다.')) {
            deleteTaskInfo(id);

            closeTodoModal();

            handleShowAlert(true, '일정이 삭제되었습니다.', 'success');
        } else {
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
                        <span className="text-sm font-semibold" style={{ color: "#1a252f" }}>{dayjs(dialogDate).format('YYYY년 MM월 DD일 dddd')}</span>
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
                        {(showSearchForm || isTodoButton || (bottomMenu === 'importantTodo')) ?
                            <IconButton aria-label="delete" size="large" onClick={closeTodoModal} sx={{ color: openColorBar.selectedColor, padding: "8px" }}>
                                <CloseIcon />
                            </IconButton>
                            :
                            <IconButton aria-label="delete" size="large" onClick={handleAddArea} sx={{ color: openColorBar.selectedColor, padding: "8px" }}>
                                <ArrowBackIcon />
                            </IconButton>
                        }
                        <div className='p-1'>

                            {selectedDateEventInfo.id ?
                                <>
                                    <button className="p-2">
                                        <FontAwesomeIcon icon={faTrash as IconProp} style={{ color: openColorBar.selectedColor }} onClick={() => deleteTask(selectedDateEventInfo.id)} />
                                    </button>
                                    <button className="p-2">
                                        <FontAwesomeIcon icon={faPenToSquare as IconProp} style={{ color: openColorBar.selectedColor }} onClick={updateTask} />
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
                                                ref={dateRef}
                                                value={dayjs(dateData.start)}
                                                onChange={(date) => { handletDate('start', date, (dateData.id !== '')) }}
                                                className={`w-22 sm:w-48 ${dayjs(dateData.start).format('YYYY-MM-DD') > dayjs(dateData.end).format('YYYY-MM-DD') ? 'date-error' : ''}`}
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" },
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                                inputRef={(e) => toDoValueRef.current['start'] = e}
                                            />
                                            {!isAllday && <TimePicker
                                                ref={timeRef}
                                                className={
                                                    `w-22 sm:w-48 custom-input ${(dayjs(`${dayjs(dateData.start).format('YYYY-MM-DD')}T${selectedTime.startTime}`) > dayjs(`${dayjs(dateData.end).format('YYYY-MM-DD')}T${selectedTime.endTime}`)) ? 'date-error' : ''}`
                                                }
                                                format="HH:mm:A"
                                                value={dayjs(selectedTime.startTime, 'HH:mm')}
                                                onChange={(date) => { handleStartTime(date) }}
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
                                                onChange={(date) => { handletDate('end', date, (dateData.id !== '')) }}
                                                className={`w-22 sm:w-48 ${dayjs(dateData.start).format('YYYY-MM-DD') > dayjs(dateData.end).format('YYYY-MM-DD') ? 'date-error' : ''}`}
                                                showDaysOutsideCurrentMonth
                                                format="YYYY-MM-DD"
                                                desktopModeMediaQuery="@media (min-width: 640px)"
                                                sx={{
                                                    "& input": { height: "18px" },
                                                    "& .MuiInputBase-root": { borderRadius: "32px" },
                                                    "@media (max-width: 640px)": {
                                                        "& input": { height: "8px", fontSize: "11px", textAlign: "center", padding: "14px 0 14px 14px" }
                                                    },
                                                    "& fieldset": { borderColor: openColorBar.selectedColor }
                                                }}
                                                inputRef={(e) => toDoValueRef.current['end'] = e}
                                            />
                                            {!isAllday && <TimePicker
                                                className={
                                                    `w-22 sm:w-48 custom-input ${(dayjs(`${dayjs(dateData.start).format('YYYY-MM-DD')}T${selectedTime.startTime}`) > dayjs(`${dayjs(dateData.end).format('YYYY-MM-DD')}T${selectedTime.endTime}`)) ? 'date-error' : ''}`
                                                }
                                                format="HH:mm:A"
                                                value={dayjs(selectedTime.endTime, 'HH:mm')}
                                                onChange={(date) => { handleEndTime(date) }}
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
                                <div className="flex justify-between items-center my-1 px-1">
                                    <div>
                                        <FontAwesomeIcon icon={faMapLocationDot as IconProp} style={{ color: openColorBar.selectedColor }} />
                                        <span className="ml-2">위치</span>
                                    </div>
                                    <div>
                                        <button className="border px-1 rounded mr-1" style={{ borderColor: openColorBar.selectedColor, color: openColorBar.selectedColor, fontSize: "12px" }} onClick={handleLocationDefault}>
                                            <FontAwesomeIcon icon={faArrowRotateLeft as IconProp} style={{ color: openColorBar.selectedColor }} />
                                            <span>초기화</span>
                                        </button>
                                        <button className="border px-1 rounded" style={{ borderColor: openColorBar.selectedColor, color: openColorBar.selectedColor, fontSize: "12px" }} onClick={() => handleShowAddrSearch(true)}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} style={{ color: openColorBar.selectedColor }} />
                                            <span>검색</span>
                                        </button>
                                        <Drawer
                                            open={showAddrSearch}
                                            onClose={() => handleShowAddrSearch(false)}
                                            anchor={"bottom"}
                                            style={{ zIndex: "9999" }}
                                            sx={{ "& .MuiDrawer-paperAnchorBottom": { maxHeight: "100%" } }}
                                        >
                                            <GoogleAddrSearchForm selectedColor={openColorBar.selectedColor} handlePlaceClickEvt={handlePlaceClickEvt} />
                                        </Drawer>
                                    </div>
                                </div>
                                <div>
                                    <small>{selectedAddr ? selectedAddr : '선택된 위치가 없습니다.'}</small>
                                    <GoogleMaps mapCenter={mapCenter}/>
                                </div>
                            </DialogContentsDiv>
                            <DialogContentsDiv>
                                <textarea placeholder="일정내용" className="outline-none w-full px-1 min-h-20" ref={(e) => { toDoValueRef.current['description'] = e }} name="description" value={dateData.description} onChange={(e) => { setTaskInfo(e.target.name, e.target.value, (dateData.id !== '')) }}></textarea>
                            </DialogContentsDiv>
                        </div>
                    </DialogContent>
                </>
            }
            <CustomAlert showAlert={showAlert} handleShowAlert={handleShowAlert} />
        </Dialog>
    );
}

export default TodoDialog;