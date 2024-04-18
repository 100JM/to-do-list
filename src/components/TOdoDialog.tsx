import { LegacyRef, useEffect, useRef, useState } from 'react';

import DialogContentsDiv from './DialogContentsDiv';
import TaskColor from './TaskColor';
import TaskColorButtons from './TaskColorButtons';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
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
import { faClockRotateLeft, faThumbTack } from '@fortawesome/free-solid-svg-icons';

interface TodoDialogInterface {
    isOpen: boolean;
    closeTodoModal: () => void;
    selectedDate: {
        startDate: string,
        endDate: string,
    };
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
}

interface OpenColorBarInterface {
    open: boolean,
    selectedColor: string,
    colorName: string,
}

const koLocale: string = dayjs.locale('ko');

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate, setStartDate, setEndDate }) => {
    const defaultStartDateTime = dayjs().set('hour', 9).set('minute', 0).startOf('minute').format('HH:mm');
    const defaultEndDateTime = dayjs().set('hour', 18).set('minute', 0).startOf('minute').format('HH:mm');
    
    const [selectedTime, setSelectedTime] = useState<{startTime:string, endTime:string}>({
        startTime: defaultStartDateTime,
        endTime: defaultEndDateTime
    });
    console.log(selectedTime);
    const [isAllday, setIsAllday] = useState<boolean>(true);
    const [openColorBar, setOpenColorBar] = useState<OpenColorBarInterface>({
        open: false,
        selectedColor: '#3788d8',
        colorName: '워터 블루'
    });

    const timeRef = useRef<HTMLDivElement | null>(null);

    const handleIsAllday = () => {
        setIsAllday((prev) => !prev)
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

    const handleStartDate = (date: Dayjs | null) => {
        if (date) {
            let formattedStartDate:string = '';

            if(isAllday) {
                formattedStartDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);
            }else {
                formattedStartDate = date.toISOString();
            }
            
            setStartDate(formattedStartDate);
        }
    };

    const handleEndtDate = (date: Dayjs | null) => {
        if (date) {
            let formattedEndDate:string = '';
            
            if(isAllday) {
                formattedEndDate = dayjs(date as Dayjs).format(`YYYY-MM-DD`);
            }else {
                formattedEndDate = date.toISOString();
            }
        
            setEndDate(formattedEndDate);
        }
    };

    const handleStartTime = (date: Dayjs | null) => {
        if(date){
            setSelectedTime((prevTime) => {
                return {
                    ...prevTime,
                    startTime: dayjs(date as Dayjs).format('HH:mm')
                }
            })
        }
    };

    const handleEndTime = (date: Dayjs | null) => {
        if(date){
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

        if(checkTimeInput){
            if(checkTimeInput.classList.contains('Mui-error')){
                alert('시작시간이 종료시간보다 이후거나 종료시간이 시작시간보다 이전일 수 없습니다.');
                return;
            }else{
                
            }
        }
    }
    
    
    return (
        <Dialog
            open={isOpen}
            onClose={closeTodoModal}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center">
                <IconButton aria-label="delete" size="large" onClick={closeTodoModal} sx={{ color: openColorBar.selectedColor }}>
                    <DeleteIcon />
                </IconButton>
                <Button variant="text" sx={{ color: openColorBar.selectedColor }} onClick={submitTask}>저장</Button>
            </DialogTitle>
            <DialogContent>
                <div className={`text-gray-700 mb-4`}>
                    <DialogContentsDiv>
                        <input type="text" placeholder="제목" name="title" className="outline-none w-full px-1" />
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
                            />
                        </div>
                        <div className="flex justify-between items-center my-3 px-1">
                            <div>
                                <span className="ml-5-5">시작일</span>
                            </div>
                            <div className="flex items-center">
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale}>
                                    <DatePicker
                                        value={dayjs(selectedDate.startDate)}
                                        onChange={(date) => { handleStartDate(date) }}
                                        className="w-22 sm:w-48"
                                        showDaysOutsideCurrentMonth
                                        format="YYYY-MM-DD"
                                        shouldDisableDate={day => {
                                            return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isAfter(
                                                selectedDate.endDate
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
                                            return dayjs(`${dayjs(selectedDate.startDate).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isAfter(dayjs(`${dayjs(selectedDate.endDate).format('YYYY-MM-DD')}T${selectedTime.endTime}`));
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
                                        value={dayjs(selectedDate.endDate)}
                                        onChange={(date) => { handleEndtDate(date) }}
                                        className="w-22 sm:w-48"
                                        showDaysOutsideCurrentMonth
                                        format="YYYY-MM-DD"
                                        shouldDisableDate={day => {
                                            return dayjs(dayjs(day as Dayjs).format(`YYYY-MM-DD`)).isBefore(
                                                selectedDate.startDate
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
                                        onChange={(date) => { handleEndTime(date)}}
                                        shouldDisableTime={time => {
                                            return dayjs(`${dayjs(selectedDate.endDate).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`).isBefore(dayjs(`${dayjs(selectedDate.startDate).format('YYYY-MM-DD')}T${selectedTime.startTime}`));
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
                                defaultChecked={false}
                                sx={{
                                    "& .MuiSwitch-thumb": { backgroundColor: openColorBar.selectedColor },
                                    "& .MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                    "& .Mui-checked+.MuiSwitch-track": { backgroundColor: openColorBar.selectedColor },
                                }}
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
                        <textarea placeholder="일정내용" className="outline-none w-full px-1 min-h-20"></textarea>
                    </DialogContentsDiv>
                </div>
            </DialogContent>
        </Dialog>
    );
    // date 유효성 check(time 분기처리 -> 따로 state를 사용하는것이 최선인가?) datepicker ui
}

export default TodoDialog;