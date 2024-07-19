import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { modalAction } from './store/modalSlice';
import { dateAction } from './store/dateSlice';

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
// import KakaoAddrSearchForm from './components/KakaoAddrSearchForm';

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

interface CustomAlertInterface {
  isShow: boolean;
  alertText: string;
  alertType: 'error' | 'warning' | 'info' | 'success';
}

function App() {
  const dispatch = useDispatch();
  const openModal = useSelector((state: RootState) => state.modal.isOpen);
  const myTodoList = useSelector((state: RootState) => state.date.todoList);
  const searchedmyTodoList = useSelector((state: RootState) => state.date.searchedToDoList);
  const importantMyTodoList = useSelector((state:RootState) => state.date.importantEventList);

  const calendarHeight: CssDimValue = '92%';
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const eventDefaultValue = {
    id: '',
    title: '',
    allDay: true,
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    color: '#3788d8',
    colorName: '워터블루',
    description: '',
    important: false,
    display: 'block',
    koreaLat: 37.5665,
    koreaLng: 126.9780,
    overseasLat: 37.5665,
    overseasLng: 126.9780,
    locationName: '',
    overseaLocationName: '',
    isKorea: true
  }

  const [showAlert, setShowAlert] = useState<CustomAlertInterface>({
    isShow: false,
    alertText: '',
    alertType: 'success'
  });

  const [showSearchForm, setShowSearchForm] = useState<boolean>(false);

  const [bottomMenu, setBottomMenu] = useState('calendar');

  useEffect(() => {
    if (showSearchForm) {
      dispatch(dateAction.searchToDoEvt((searchInputRef.current?.value !== undefined) ? searchInputRef.current?.value : ''));
    }

    dispatch(dateAction.getImportantTodoList());
  }, [myTodoList, showSearchForm]);

  const handleBottomMenuChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== 'todo') {
      setBottomMenu(newValue);
    }
  };

  const searchButtonClickEvt = (isShow: boolean) => {
    setShowSearchForm(isShow);

    if (!isShow) {
      setBottomMenu('calendar')
    }
  };

  const dateClickEvt = (arg: DateClickArg) => {
    arg.jsEvent.stopPropagation();
    arg.jsEvent.preventDefault();

    const todoEventList = arg.view.calendar.getEvents().map((event: EventApi) => {
      return {
        id: event.id,
        allDay: event.allDay,
        startStr: event.startStr,
        endStr: event.endStr,
        title: event.title,
        backgroundColor: event.backgroundColor
      };
    });

    dispatch(dateAction.dateClickEvt({
      dateStr: arg.dateStr,
      selectedDateEvt: todoEventList,
    }));

    dispatch(dateAction.setSelectedEventInfoDefault(eventDefaultValue));
    dispatch(modalAction.handleModal(true));
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

  const searchResultClickEvt = (id: string) => {
    dispatch(dateAction.getSelectedEventInfo(id));

    dispatch(modalAction.handleAddArea(true));
    dispatch(modalAction.handleModal(true));
  };

  const todoButtonEvt = () => {
    dispatch(dateAction.setSelectedDate());

    dispatch(dateAction.setSelectedEventInfoDefault(eventDefaultValue));

    dispatch(modalAction.handleIsTodoButton(true));
    dispatch(modalAction.handleAddArea(true));
    dispatch(modalAction.handleModal(true));
  };

  const desktopMenuEvt = (value: string) => {
    if (value === 'importantTodo') {
      dispatch(dateAction.getImportantTodoList());
    }

    setBottomMenu(value);
  }
  
  return (
    <>
      {openModal && <TodoDialog
        handleShowAlert={handleShowAlert}
        showAlert={showAlert}
        showSearchForm={showSearchForm}
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
                events={myTodoList}
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
                    (importantMyTodoList.length > 0) ?
                    importantMyTodoList.map((i) => {
                        const importantEndDate: string = i.allDay ? dayjs(i.end).add(-1, 'day').format('YYYY-MM-DD') : i.end.split('T')[0];
                        const importantEndDday: number = dayjs(importantEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');

                        return (
                          <div key={i.id} className="p-2 border border-gray-300 rounded-xl shadow mb-3 flex cursor-pointer hover:bg-gray-100" onClick={() => searchResultClickEvt(i.id)}>
                            <div className="w-4 rounded-md mr-2" style={{ backgroundColor: `${i.color}` }}></div>
                            <div style={{width: "calc(100% - 1.5rem)"}}>
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
                      :
                      <div className="w-full h-full flex items-center justify-center text-base">
                        등록된 중요 일정이 없습니다.
                      </div>
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
                    importantMyTodoList.filter((i) => {
                      const importantEndDate: string = i.allDay ? dayjs(i.end).add(-1, 'day').format('YYYY-MM-DD') : i.end.split('T')[0];
                      const importantEndDday: number = dayjs(importantEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');

                      return (
                        importantEndDday >= 0 && importantEndDday <= 3
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
                      importantMyTodoList.filter((i) => {
                        const importantEndDate: string = i.allDay ? dayjs(i.end).add(-1, 'day').format('YYYY-MM-DD') : i.end.split('T')[0];
                        const importantEndDday: number = dayjs(importantEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');
  
                        return (
                          importantEndDday >= 0 && importantEndDday <= 3
                        )
                      }).length
                    }
                      color="error">
                      <PushPinIcon />
                    </Badge>
                  }
                  onClick={() => dispatch(dateAction.getImportantTodoList())}
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
              <input type="text" className="h-full w-full p-2 outline-none" placeholder="키워드" ref={searchInputRef} onChange={(e) => dispatch(dateAction.searchToDoEvt(e.target.value))} />
            </div>
            <div className="w-full overflow-y-auto" style={{ height: "calc(100% - 5.55rem)" }}>
              {
                searchedmyTodoList.length === 0 && !searchInputRef.current?.value &&
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  <span>키워드를 입력하세요.</span>
                </div>
              }
              {
                searchedmyTodoList.length === 0 && searchInputRef.current?.value &&
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  <span>검색 결과가 없습니다.</span>
                </div>
              }
              {
                searchedmyTodoList.length > 0 && searchInputRef.current?.value &&
                searchedmyTodoList.map((t) => {
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