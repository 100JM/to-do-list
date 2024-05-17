import { useCallback, useState, useRef, useEffect } from 'react';

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

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';

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
    display: 'block'
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
    display: 'block'
  });

  const [toDoList, setToDoList] = useState<Array<any>>(
    [
      {
        id: '1',
        title: 'event1',
        start: '2024-05-08T09:00',
        end: '2024-05-09T18:00',
        color: '#3788d8',
        colorName: '워터블루',
        allDay: false,
        important: false,
        display: "block"
      },
      {
        id: '2',
        title: 'event2',
        start: '2024-05-10T09:00',
        end: '2024-05-10T10:00',
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
        start: '2024-05-10',
        end: '2024-05-11',
        color: '#FA8072',
        colorName: '살몬',
        allDay: true,
        important: false,
        description: '조정 작업 완료',
        display: "block"
      },
      {
        id: '4',
        title: 'event4',
        start: '2024-05-11T09:00',
        end: '2024-05-19T13:30',
        color: '#FA8072',
        colorName: '살몬',
        allDay: false,
        important: true,
        display: "block"
      }
    ]
  );

  const [searchedToDoList, setSearchedToDoList] = useState<Array<any>>([]);
  const [bottomMenu, setBottomMenu] = useState('calendar');

  useEffect(() => {
    if (showSearchForm) {
      searchToDoEvt((searchInputRef.current?.value !== undefined) ? searchInputRef.current?.value : '');
    }

    if(bottomMenu === 'importantTodo') {
      getImportantTodoList();
    }
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
        display: 'block'
      }
    });

    setIsOpen(true);
  };

  const closeTodoModal = useCallback(() => {
    setIsOpen(false);
    setIsAddArea(false);
    setIsTodoButton(false);
  }, []);

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
        display: 'block'
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
        display: 'block'
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
              <div style={{ width: "100%", height: "92%", overflowY: "auto" }}>
                {
                  importantEventList.map((i) => {
                    return (
                      <div className="p-2 border border-gray-300 rounded-xl shadow mb-3 flex cursor-pointer">
                        <div className="w-4 rounded-md mr-2" style={{backgroundColor: `${i.color}`}}></div>
                        <div className="w-full">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{i.title}</div>
                          <div>{`시작일: ${i.start.split('T')[0]}`}</div>
                          <div>{`종료일: ${i.end.split('T')[0]}`}</div>
                        </div>
                      </div>
                    ) // 남은 기간 d-day & 클릭 시 dialog & 수정
                  })
                }
              </div>
            }
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
                <BottomNavigationAction label="중요 일정" value="importantTodo" icon={<PushPinIcon />} onClick={getImportantTodoList} />
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
            <div className="w-full" style={{ height: "calc(100% - 5.55rem)" }}>
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
                searchedToDoList.map((t) => {
                  return (
                    <div key={t.id} className="w-full h-18 py-2 flex justify-start items-center border-b cursor-pointer hover:bg-gray-100" onClick={() => searchResultClickEvt(t.id)}>
                      <div className="w-full h-full">
                        <div className="text-white rounded p-1 mb-1" style={{ backgroundColor: `${t.color}` }}>
                          {t.start.split('T')[0]}
                        </div>
                        <div>{t.title}</div>
                        <div>{t.description ? t.description : '-'}</div>
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

export default App
