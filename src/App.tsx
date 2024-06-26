import { useState, useRef, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CssDimValue, EventApi } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

import dayjs from 'dayjs';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CSSTransition } from 'react-transition-group';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import TodoDialog from './components/TaskDialog';
import CustomAlert from './components/CustomAlert';
import KakaoAddrSearchForm from './components/KakaoAddrSearchForm';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Badge from '@mui/material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

interface SelectedDateInterface {
  id: string;
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color: string;
  colorName: string;
  description: string;
  important: boolean;
  display: string;
  lat: number;
  lng: number;
  locationName: string;
}

interface CustomAlertInterface {
  isShow: boolean;
  alertText: string;
  alertType: 'error' | 'warning' | 'info' | 'success';
}

function App() {
  const calendarHeight: CssDimValue = '92%';
  const defaultStartDate: string = new Date().toISOString();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDate, setSelectedDate] = useState<SelectedDateInterface>({
    id: '',
    title: '',
    allDay: true,
    start: defaultStartDate,
    end: defaultStartDate,
    color: '#3788d8',
    colorName: '워터블루',
    description: '',
    important: false,
    display: 'block',
    lat: 37.5665, 
    lng: 126.9780,
    locationName: ''
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAddArea, setIsAddArea] = useState<boolean>(false);
  const [isTodoButton, setIsTodoButton] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<CustomAlertInterface>({
    isShow: false,
    alertText: '',
    alertType: 'success'
  });

  const [showSearchForm, setShowSearchForm] = useState<boolean>(false);
  const [selectedDateEventList, setSelectedDateEventList] = useState<Array<any>>([]);
  const [importantEventList, setImportantEventList] = useState<Array<any>>([]);

  const [selectedDateEventInfo, setSelectedDateEventInfo] = useState<SelectedDateInterface>({
    id: '',
    title: '',
    allDay: true,
    start: defaultStartDate,
    end: defaultStartDate,
    color: '#3788d8',
    colorName: '워터블루',
    description: '',
    important: false,
    display: 'block',
    lat: 37.5665, 
    lng: 126.9780,
    locationName: ''
  });

  const [toDoList, setToDoList] = useState<Array<any>>(
    [
      {
        id: '1',
        title: 'Aevent',
        start: '2024-06-08T09:00',
        end: '2024-06-09T18:00',
        color: '#3788d8',
        colorName: '워터블루',
        allDay: false,
        important: false,
        display: "block"
      },
      {
        id: '2',
        title: 'Cevent',
        start: '2024-06-10T09:00',
        end: '2024-06-10T10:00',
        color: '#3788d8',
        colorName: '워터블루',
        allDay: false,
        important: true,
        description: '테스트입니다.',
        display: "block"
      },
      {
        id: '3',
        title: '긴 이름의 일정이 등록되었을때 css 조정 작업이 필요합니다.',
        start: '2024-06-10',
        end: '2024-06-11',
        color: '#FA8072',
        colorName: '살몬',
        allDay: true,
        important: false,
        description: '조정 작업 완료',
        display: "block"
      },
      {
        id: '4',
        title: '여행',
        start: '2024-06-14',
        end: '2024-06-20',
        color: '#FA8072',
        colorName: '살몬',
        allDay: true,
        important: true,
        display: "block",
        lat: 12.2529152,
        lng: 109.1899018,
        locationName: '냐짱, 베트남 칸호아 냐짱'
      }
    ]
  );

  const [searchedToDoList, setSearchedToDoList] = useState<Array<any>>([]);
  const [bottomMenu, setBottomMenu] = useState('calendar');

  useEffect(() => {
    if (showSearchForm) {
      searchToDoEvt((searchInputRef.current?.value !== undefined) ? searchInputRef.current?.value : '');
    }

    // if (bottomMenu === 'importantTodo') {
    getImportantTodoList();
    // }
  }, [toDoList]);

  const handleBottomMenuChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== 'todo') {
      setBottomMenu(newValue);
    }
  };

  const addNewTodoList = (newToDo: object) => {
    setToDoList((prevList) => [...prevList, newToDo]);
  }

  const updateTaskInfo = (taskInfo: any) => {
    setToDoList(prevList => prevList.map(i => {
      if (i.id === taskInfo.id) {
        return taskInfo;
      }

      return i;
    }));
  };

  const deleteTaskInfo = (taskId: string) => {
    setToDoList(prevList => prevList.filter((i) => {
      return i.id !== taskId;
    }));
  }

  const searchButtonClickEvt = (isShow: boolean) => {
    setShowSearchForm(isShow);

    if (!isShow) {
      setBottomMenu('calendar')
    }
  };

  const dateClickEvt = (arg: DateClickArg) => {
    const selectedDateEvt = arg.view.calendar.getEvents().filter((event: EventApi) => {
      if (!event.allDay) {
        return dayjs(event.startStr.split('T')[0]).format('YYYY-MM-DD') <= arg.dateStr && arg.dateStr <= dayjs(event.endStr.split('T')[0]).format('YYYY-MM-DD');
      } else {
        return dayjs(event.startStr.split('T')[0]).format('YYYY-MM-DD') <= arg.dateStr && arg.dateStr < dayjs(event.endStr.split('T')[0]).format('YYYY-MM-DD');
      }
    })

    setSelectedDateEventList(selectedDateEvt);

    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        id: '',
        title: '',
        allDay: true,
        start: arg.dateStr,
        end: arg.dateStr,
        color: '#3788d8',
        colorName: '워터블루',
        description: '',
        important: false,
        display: 'block',
        lat: 37.5665, 
        lng: 126.9780,
        locationName: ''
      }
    });

    setIsOpen(true);
  };

  const closeTodoModal = () => {
    setIsOpen(false);
    setIsAddArea(false);
    setIsTodoButton(false);
  };

  const getSelectedEventInfo = (id: string) => {
    const selectedTodo = toDoList.find((t) => {
      return t.id === id;
    });

    setSelectedDateEventInfo((prevDate) => {
      return {
        ...prevDate,
        ...selectedTodo
      }
    })
  };

  const setTaskInfo = (name: string, value: string | boolean, isUpdate: boolean) => {
    if (!isUpdate) {
      setSelectedDate((prevInfo) => {
        return {
          ...prevInfo,
          [name]: value
        }
      });
    } else {
      setSelectedDateEventInfo((prevInfo) => {
        return {
          ...prevInfo,
          [name]: value
        }
      });
    }

  };

  const setSelectedEventInfoDefault = () => {
    setSelectedDateEventInfo((prev) => {
      return {
        ...prev,
        id: '',
        title: '',
        allDay: true,
        start: defaultStartDate,
        end: defaultStartDate,
        color: '#3788d8',
        colorName: '워터블루',
        description: '',
        important: false,
        display: 'block',
        lat: 37.5665, 
        lng: 126.9780,
        locationName: ''
      }
    });
  };

  const handleShowAlert = (isShow: boolean, alertText: string, alertType: 'error' | 'warning' | 'info' | 'success') => {
    setShowAlert((prev) => {
      return {
        ...prev,
        isShow: isShow,
        alertText: alertText,
        alertType: alertType
      }
    });
  };

  const searchToDoEvt = (keyWord: string) => {
    keyWord = keyWord.replace(/\s/g, '');

    const searchResult = toDoList.filter((t) => {
      if (keyWord) {
        if (t.title?.replace(/\s/g, '').includes(keyWord) || t.description?.replace(/\s/g, '').includes(keyWord)) {
          return t;
        }
      }
    });

    setSearchedToDoList(searchResult);
  };

  const searchResultClickEvt = (id: string) => {
    getSelectedEventInfo(id);
    setIsAddArea(true);
    setIsOpen(true);
  };

  const todoButtonEvt = () => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        id: '',
        title: '',
        allDay: true,
        start: defaultStartDate,
        end: defaultStartDate,
        color: '#3788d8',
        colorName: '워터블루',
        description: '',
        important: false,
        display: 'block',
        lat: 37.5665, 
        lng: 126.9780,
        locationName: ''
      }
    });

    setSelectedEventInfoDefault();
    setIsTodoButton(true);
    setIsAddArea(true);
    setIsOpen(true);
  };

  const getImportantTodoList = () => {
    const importantTodoList = toDoList.filter((t) => {
      return t.important === true;
    });

    setImportantEventList(importantTodoList);
  };

  const desktopMenuEvt = (value: string) => {
    if (value === 'importantTodo') {
      getImportantTodoList();
    }

    setBottomMenu(value);
  }

  return (
    <>
      {isOpen && <TodoDialog
        isOpen={isOpen}
        closeTodoModal={closeTodoModal}
        selectedDate={selectedDate}
        addNewTodoList={addNewTodoList}
        updateTaskInfo={updateTaskInfo}
        deleteTaskInfo={deleteTaskInfo}
        selectedDateEventList={selectedDateEventList}
        getSelectedEventInfo={getSelectedEventInfo}
        setTaskInfo={setTaskInfo}
        selectedDateEventInfo={selectedDateEventInfo}
        setSelectedEventInfoDefault={setSelectedEventInfoDefault}
        handleShowAlert={handleShowAlert}
        showAlert={showAlert}
        isAddArea={isAddArea}
        setIsAddArea={setIsAddArea}
        showSearchForm={showSearchForm}
        isTodoButton={isTodoButton}
        bottomMenu={bottomMenu}
      />}
      <section className="fixed top-0 left-0 right-0 bottom-0 p-4 text-sm font-sans">
        <CSSTransition
          in={!showSearchForm}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <div className="w-full h-full">
            {
              bottomMenu === 'calendar' &&
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={false}
                // height={calendarHeight}
                locale={koLocale}
                customButtons={{
                  searchButton: {
                    icon: 'bi bi-search',
                    click: () => { searchButtonClickEvt(true) },
                  },
                }}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'searchButton',
                }}
                dateClick={dateClickEvt}
                events={toDoList}
                displayEventTime={false}
                timeZone='UTC'
              />
            }
            {
              bottomMenu === 'importantTodo' &&
              <>
                <div className="w-full h-10 flex items-center pb-2"><span className="text-center flex-grow text-lg">중요 일정</span></div>
                <div style={{ width: "100%", height: "calc(92% - 2.5rem)", overflowY: "auto" }}>
                  {
                    importantEventList.sort((a, b) => {
                      const dateA = new Date(a.end.split('T')[0]);
                      const dateB = new Date(b.end.split('T')[0]);

                      return dateA.getTime() - dateB.getTime();
                    }).map((i) => {
                      const importantEndDate:string = i.allDay ? dayjs(i.end).add(-1, 'day').format('YYYY-MM-DD') : i.end.split('T')[0];
                      const importantEndDday:number = dayjs(importantEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');
                      
                      return (
                        <div key={i.id} className="p-2 border border-gray-300 rounded-xl shadow mb-3 flex cursor-pointer hover:bg-gray-100" onClick={() => searchResultClickEvt(i.id)}>
                          <div className="w-4 rounded-md mr-2" style={{ backgroundColor: `${i.color}` }}></div>
                          <div className="w-full">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">{i.title}</div>
                            <div>{`시작일 ${i.start.split('T')[0]}`}</div>
                            <div className="flex justify-between">
                              <div>{`종료일 ${importantEndDate}`}</div>
                              <div>
                                {
                                  (importantEndDday > 0) ?
                                    (
                                      (importantEndDday <= 3) ?
                                        <>
                                          <i className="bi bi-alarm text-red-500">
                                            {` D-day ${importantEndDday}일`}
                                          </i>
                                        </>
                                        :
                                        ` D-day ${importantEndDday}일`
                                    )
                                    :
                                    (
                                      (importantEndDday === 0) ?
                                        <>
                                          <i className="bi bi-alarm text-red-500">
                                            {'D-day 오늘'}
                                          </i>
                                        </>
                                        :
                                        '종료된 일정'
                                    )
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            }
            <SpeedDial
              ariaLabel="Desktop SpeedDial"
              icon={<SpeedDialIcon />}
              sx={{
                display: "none",
                "@media (min-width:720px)": {
                  display: "flex",
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                }
              }}
              direction="up"
            >
              <SpeedDialAction key="calendar" icon={<CalendarMonthIcon />} tooltipTitle="캘린더" onClick={() => desktopMenuEvt('calendar')} />
              <SpeedDialAction key="todo" icon={<AddCircleOutlineIcon />} tooltipTitle="일정 추가" onClick={todoButtonEvt} />
              <SpeedDialAction
                key="importantTodo"
                icon={
                  <Badge badgeContent={
                    importantEventList.filter((i) => {
                      return (
                        dayjs(i.end.split('T')[0]).diff(dayjs(), 'day') <= 3 && dayjs(i.end.split('T')[0]).diff(dayjs(), 'day') >= 0
                      )
                    }).length
                  }
                    color="error">
                    <PushPinIcon />
                  </Badge>
                }
                tooltipTitle="중요 일정"
                onClick={() => desktopMenuEvt('importantTodo')}
              />
            </SpeedDial>
            <Box sx={{
              width: "100%",
              height: "8%",
              display: "block",
              "& .MuiBottomNavigationAction-root": { color: "#2c3e50" },
              "@media (min-width:720px)": {
                display: "none"
              }
            }}>
              <BottomNavigation
                showLabels
                value={bottomMenu}
                onChange={handleBottomMenuChange}
                sx={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignContent: "center"
                }}
              >
                <BottomNavigationAction label="캘린더" value="calendar" icon={<CalendarMonthIcon />} />
                <BottomNavigationAction label="일정 작성" value="todo" icon={<AddCircleOutlineIcon />} sx={{ color: "#DC143C !important" }} onClick={todoButtonEvt} />
                <BottomNavigationAction
                  label="중요 일정"
                  value="importantTodo"
                  icon={
                    <Badge badgeContent={
                      importantEventList.filter((i) => {
                        return (
                          dayjs(i.end.split('T')[0]).diff(dayjs(), 'day') <= 3 && dayjs(i.end.split('T')[0]).diff(dayjs(), 'day') >= 0
                        )
                      }).length
                    }
                      color="error">
                      <PushPinIcon />
                    </Badge>
                  }
                  onClick={getImportantTodoList}
                />
              </BottomNavigation>
            </Box>
          </div>
        </CSSTransition>
        <CSSTransition
          in={showSearchForm}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <div className="h-full w-full p-4">
            <div className="w-full h-10 flex items-center justify-between pb-2">
              <ArrowBackIcon onClick={() => searchButtonClickEvt(false)} sx={{ cursor: "pointer" }} />
              <span className="text-center flex-grow mr-6 text-lg">검색</span>
            </div>
            <div className="w-full h-10 border rounded-md p-1 border-gray-400 flex items-center justify-center mb-3">
              <SearchIcon />
              <input type="text" className="h-full w-full p-2 outline-none" placeholder="키워드" ref={searchInputRef} onChange={(e) => searchToDoEvt(e.target.value)} />
            </div>
            <div className="w-full overflow-y-auto" style={{ height: "calc(100% - 5.55rem)" }}>
              {
                searchedToDoList.length === 0 && !searchInputRef.current?.value &&
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  <span>키워드를 입력하세요.</span>
                </div>
              }
              {
                searchedToDoList.length === 0 && searchInputRef.current?.value &&
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  <span>검색 결과가 없습니다.</span>
                </div>
              }
              {
                searchedToDoList.length > 0 && searchInputRef.current?.value &&
                searchedToDoList.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase())).map((t) => {
                  return (
                    <div key={t.id} className="w-full h-18 py-2 flex justify-start items-center border-b cursor-pointer hover:bg-gray-100" onClick={() => searchResultClickEvt(t.id)}>
                      <div className="w-full h-full">
                        <div className="text-white rounded p-1 mb-1" style={{ backgroundColor: `${t.color}` }}>
                          {t.start.split('T')[0]}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{t.title}</div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{t.description ? t.description : '-'}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </CSSTransition>
        <CustomAlert showAlert={showAlert} handleShowAlert={handleShowAlert} />
      </section>
    </>
  )
}

export default App;