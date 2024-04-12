import { useEffect, useRef, useState } from 'react';

import DialogContentsDiv from './DialogContentsDiv';
import TaskColor from './TaskColor';

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

interface TodoDialogInterface {
    isOpen: boolean;
    closeTodoModal: () => void;
    selectedDate: {
        startDate: string,
        endDate: string,
    };
}

interface OpenColorBarInterface {
    open: boolean,
    selectedColor: string,
    colorName: string,
}

const TodoDialog: React.FC<TodoDialogInterface> = ({ isOpen, closeTodoModal, selectedDate }) => {
    const defaultStartDateTime = dayjs().set('hour', 9).set('minute', 0).startOf('minute');
    const defaultEndDateTime = dayjs().set('hour', 18).set('minute', 0).startOf('minute');

    const [isAllday, setIsAllday] = useState<boolean>(true);
    const [openColorBar, setOpenColorBar] = useState<OpenColorBarInterface>({
        open: false,
        selectedColor: '#3788d8',
        colorName: '워터 블루'
    });

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.show();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    const handleIsAllday = () => {
        setIsAllday(!isAllday);
    }

    const handleDraw = (newOpen:boolean) => {
        setOpenColorBar((prevState) => {
            return {
                ...prevState,
                open: newOpen
            }
        });
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeTodoModal}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center">
                <IconButton aria-label="delete" size="large" onClick={closeTodoModal}>
                    <DeleteIcon />
                </IconButton>
                <Button variant="text">저장</Button>
            </DialogTitle>
            <DialogContent>
                <div className="text-gray-700 mb-4">
                    <DialogContentsDiv>
                        <input type="text" placeholder="제목" name="title" className="outline-none w-full px-1" />
                    </DialogContentsDiv>
                    <DialogContentsDiv>
                        <div className="flex justify-between items-center my-1 px-1">
                            <div>하루종일</div>
                            <Switch color="primary" defaultChecked={isAllday} onChange={handleIsAllday} />
                        </div>
                        <div className="flex justify-between items-center my-3 px-1">
                            <div>시작일</div>
                            <div className="flex items-center">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={dayjs(selectedDate.startDate)}
                                        onChange={() => { }}
                                        className="w-22 sm:w-48"
                                        showDaysOutsideCurrentMonth
                                        format="YYYY-MM-DD"
                                        desktopModeMediaQuery="@media (min-width: 640px)"
                                        sx={{
                                            "& input": { height: "18px" }, // width - 610 -> media
                                            "& .MuiInputBase-root": { borderRadius: "32px" },
                                            '@media (max-width: 640px)': {
                                                "& input": { height: "8px", fontSize: "12px", textAlign: "center", padding: "14px 0 14px 14px" }
                                            }
                                        }}
                                    />
                                    {!isAllday && <TimePicker
                                        className="w-22 sm:w-48 custom-input"
                                        format="H:mm:A"
                                        value={defaultStartDateTime}
                                        desktopModeMediaQuery="@media (min-width: 640px)"
                                        sx={{
                                            "& input": { height: "18px" },
                                            "& .MuiInputBase-root": { borderRadius: "32px" },
                                            '@media (max-width: 640px)': {
                                                "& input": { height: "8px", fontSize: "12px", textAlign: "center", padding: "14px 0 14px 14px" }
                                            }
                                        }}
                                    />}
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="flex justify-between items-center my-3 px-1">
                            <div>종료일</div>
                            <div className="flex items-center">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={dayjs(selectedDate.endDate)}
                                        onChange={() => { }}
                                        className="w-22 sm:w-48"
                                        showDaysOutsideCurrentMonth
                                        format="YYYY-MM-DD"
                                        desktopModeMediaQuery="@media (min-width: 640px)"
                                        sx={{
                                            "& input": { height: "18px" },
                                            "& .MuiInputBase-root": { borderRadius: "32px" },
                                            '@media (max-width: 640px)': {
                                                "& input": { height: "8px", fontSize: "12px", textAlign: "center", padding: "14px 0 14px 14px" }
                                            }
                                        }}
                                    />
                                    {!isAllday && <TimePicker
                                        className="w-22 sm:w-48 custom-input"
                                        format="H:mm:A"
                                        value={defaultEndDateTime}
                                        desktopModeMediaQuery="@media (min-width: 640px)"
                                        sx={{
                                            "& input": { height: "18px" },
                                            "& .MuiInputBase-root": { borderRadius: "32px" },
                                            '@media (max-width: 640px)': {
                                                "& input": { height: "8px", fontSize: "12px", textAlign: "center", padding: "14px 0 14px 14px" }
                                            }
                                        }}
                                    />}
                                </LocalizationProvider>
                            </div>
                        </div>
                    </DialogContentsDiv>
                    <DialogContentsDiv>
                        <div className="flex justify-between items-center my-1 px-1">
                            <div>중요일정</div>
                            <Switch color="primary" defaultChecked={false} />
                        </div>
                    </DialogContentsDiv>
                    <DialogContentsDiv>
                        <TaskColor handleDraw={handleDraw} selectedColor={openColorBar.selectedColor} colorName={openColorBar.colorName} />
                        <Drawer open={openColorBar.open} onClose={() => handleDraw(false)} anchor={"bottom"}>
                            <div>test</div>
                            <div>test</div>
                            <div>test</div>
                            <div>test</div>
                            <div>test</div>
                            <div>test</div>
                            <div>test</div> {/*createPortal?*/}
                        </Drawer>
                    </DialogContentsDiv>
                </div>
            </DialogContent>
        </Dialog>
    );

    // return createPortal(
    //     <dialog className="bg-white shadow-2xl rounded-lg p-6 w-11/12 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-1/2" ref={dialogRef} onClose={closeTodoModal} onKeyDown={escKeyDown}>
    //         <div className="flex justify-between">
    //             <IconButton aria-label="delete" size="large" onClick={closeTodoModal}>
    //                 <DeleteIcon />
    //             </IconButton>
    //             <Button variant="text">저장</Button>
    //         </div>
    //         <div className="flex items-center justify-between mb-4">
    //             <h2 className="text-lg font-semibold text-gray-800">일정 등록</h2>
    //         </div>
    //         <div className="text-gray-700 mb-4">
    //             <div className="border-gray-300 border-b p-2">
    //                 <input type="text" placeholder="제목" name="title" className="outline-none w-full" />
    //             </div>
    //             <div className="border-gray-300 border-b p-2">
    //                 <div className="flex justify-between items-center my-3">
    //                     <div>하루종일</div>
    //                     <Switch color="primary" defaultChecked={isAllday} onChange={handleIsAllday} />
    //                 </div>
    //                 <div className="flex justify-between items-center my-3">
    //                     <div>시작일</div>
    //                     <div>
    //                         <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                             <div className="inline-block mr-3">
    //                                 <DatePicker
    //                                     label="시작일"
    //                                     value={dayjs(selectedDate.startDate)}
    //                                     onChange={() => { }}
    //                                     className="z-50 pr-4"
    //                                     showDaysOutsideCurrentMonth
    //                                     format="YYYY-MM-DD"
    //                                     desktopModeMediaQuery="@media (min-width: full)"
    //                                 />
    //                             </div>
    //                             {!isAllday && <TimePicker
    //                                 className="z-50"
    //                                 format="H:mm:A"
    //                                 value={defaultStartDateTime}
    //                                 desktopModeMediaQuery="@media (min-width: full)"
    //                             />}
    //                         </LocalizationProvider>
    //                     </div>
    //                 </div>
    //                 <div className="flex justify-between items-center my-3">
    //                     <div>종료일</div>
    //                     <div>
    //                         <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                         <div className="inline-block mr-3">
    //                             <DatePicker
    //                                 label="종료일"
    //                                 value={dayjs(selectedDate.endDate)}
    //                                 onChange={() => { }}
    //                                 className="z-50"
    //                                 showDaysOutsideCurrentMonth
    //                                 format="YYYY-MM-DD"
    //                                 desktopModeMediaQuery="@media (min-width: full)"
    //                             />
    //                         </div>
    //                             {!isAllday && <TimePicker
    //                                 className="z-50"
    //                                 format="H:mm:A"
    //                                 value={defaultEndDateTime}
    //                                 desktopModeMediaQuery="@media (min-width: full)"
    //                             />}
    //                         </LocalizationProvider>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </dialog>
    //     ,
    //     document.getElementById('modal')!
    // )
}

export default TodoDialog;