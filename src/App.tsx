import { useCallback, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CssDimValue, EventApi } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

import dayjs from 'dayjs';

import TodoDialog from './components/TaskDialog';
import CustomAlert from './components/CustomAlert';

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
  const calenderHeight: CssDimValue = '100%';
  const defaultStartDate: string = new Date().toISOString();

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
  const [showAlert, setShowAlert] = useState<CustomAlertInterface>({
    isShow: false,
    alertText: '',
    alertType: 'success'
  });
  const [selectedDateEventList, setSelectedDateEventList] = useState<Array<any>>([]);
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
        important: false,
        display: "block"
      }
    ]
  );

  const addNewTodoList = (newToDo: object) => {
    setToDoList((prevList) => [...prevList, newToDo]);
  }

  const updateTaskInfo = (taskInfo:any) => {
    setToDoList(prevList => prevList.map(i => {
      if(i.id === taskInfo.id) {
        return {
          ...i,
          ...taskInfo
        };
      }

      return i;
    }));
  };

  const deleteTaskInfo = (taskId:string) => {
    setToDoList(prevList => prevList.filter((i) => {
      return i.id !== taskId;
    }));
  }

  const customButtonClickEvt = useCallback(() => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
      }
    })

    setIsOpen(true);
  }, []);

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

  const setTaskInfo = (name: string, value: string | boolean) => {
    setSelectedDate((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value
      }
    });

    setSelectedDateEventInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value
      }
    });
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

  const handleShowAlert = (isShow:boolean, alertText:string, alertType: 'error' | 'warning' | 'info' | 'success') => {
    setShowAlert((prev) => {
      return {
        ...prev,
        isShow: isShow,
        alertText: alertText,
        alertType: alertType
      }
    });
  }

  return (
    <>
      {isOpen && <TodoDialog isOpen={isOpen} closeTodoModal={closeTodoModal} selectedDate={selectedDate} addNewTodoList={addNewTodoList} updateTaskInfo={updateTaskInfo} deleteTaskInfo={deleteTaskInfo} selectedDateEventList={selectedDateEventList} getSelectedEventInfo={getSelectedEventInfo} setTaskInfo={setTaskInfo} selectedDateEventInfo={selectedDateEventInfo} setSelectedEventInfoDefault={setSelectedEventInfoDefault} handleShowAlert={handleShowAlert} showAlert={showAlert} />}
      <section className="fixed top-0 left-0 right-0 bottom-0 p-4 text-sm font-sans">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={false}
          height={calenderHeight}
          locale={koLocale}
          customButtons={{
            addTodoButton: {
              text: '일정등록',
              click: customButtonClickEvt,
            },
          }}
          headerToolbar={{
            left: 'prev,next today addTodoButton',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          dateClick={dateClickEvt}
          events={toDoList}
          displayEventTime={false}
          timeZone='UTC'
        />
        <CustomAlert showAlert={showAlert} handleShowAlert={handleShowAlert}/>
      </section>
    </>
  )
}

export default App
