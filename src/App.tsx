import { useCallback, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CssDimValue, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

import dayjs from 'dayjs';

import TodoDialog from './components/TOdoDialog';

function App() {
  const calenderHeight: CssDimValue = '100%';
  const defaultStartDate:string = new Date().toISOString();
  
  const [selectedDate, setSelectedDate] = useState<{ startDate: string; endDate: string; }>({
    startDate: defaultStartDate,
    endDate: defaultStartDate
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDateEventList, setSelectedDateEventList] = useState<Array<any>>([]);

  const [toDoList , setToDoList] = useState<Array<any>>(
    [
      {
        id: 1,
        title: 'event1',
        start: '2024-04-08',
        end: '2024-04-10',
        color: '#3788d8',
        allDay: true,
        display: "block"
      },
      {
        id: 2,
        title: 'event2',
        start: '2024-04-10T09:00',
        end: '2024-04-10T10:00',
        color: '#3788d8',
        allDay: false,
        display: "block"
      },
      {
        id: 3,
        title: '긴 이름의 일정이 등록되었을때 css 조정 작업이 필요합니다.',
        start: '2024-04-10',
        end: '2024-04-11',
        color: '#FA8072',
        allDay: true,
        display: "block"
      },
      {
        id: 4,
        title: 'event4',
        start: '2024-04-11T09:00',
        end: '2024-04-19T13:30',
        color: '#FA8072',
        allDay: false,
        display: "block"
      }
    ]
  );

  const addNewTodoList = (newToDo:object) => {
    setToDoList((prevList) => [...prevList, newToDo]);
  }

  const customButtonClickEvt = useCallback(() => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      }
    })

    setIsOpen(true);
  }, []);

  const dateClickEvt = (arg: DateClickArg) => {
    const selectedDateEvt = arg.view.calendar.getEvents().filter((event:EventApi) => {
      if(!event.allDay) {
        return dayjs(event.startStr).format('YYYY-MM-DD') <= arg.dateStr && arg.dateStr <= dayjs(event.endStr).format('YYYY-MM-DD');
      }else {
        return dayjs(event.startStr).format('YYYY-MM-DD') <= arg.dateStr && arg.dateStr < dayjs(event.endStr).format('YYYY-MM-DD');
      }
    })
    
    setSelectedDateEventList(selectedDateEvt);

    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        startDate: arg.dateStr,
        endDate: arg.dateStr
      }
    })

    setIsOpen(true);
  };

  const eventClickEvt = (arg: EventClickArg) => {
    arg.jsEvent.stopPropagation();
    arg.jsEvent.preventDefault();

    // dateClick 함수를 실행? -> dateClick 함수에서 타입 체크해서 분기처리?
  };

  
  const closeTodoModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dateSelecting = (arg: DateSelectArg) => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        startDate: arg.startStr,
        endDate: arg.endStr
      }
    })
    setIsOpen(true);
  }

  const setStartDate = (startDate:string) => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        startDate: startDate,
      }
    })
  };

  const setEndDate = (endDate:string) => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        endDate: endDate,
      }
    })
  };
  
  return (
    <>
      {isOpen && <TodoDialog isOpen={isOpen} closeTodoModal={closeTodoModal} selectedDate={selectedDate} setStartDate={setStartDate} setEndDate={setEndDate} addNewTodoList={addNewTodoList} selectedDateEventList={selectedDateEventList}/>}
      <section className="fixed top-0 left-0 right-0 bottom-0 p-4 text-sm font-sans">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
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
          eventClick={eventClickEvt}
          selectable={true}
          select={dateSelecting}
          displayEventTime={false}
          timeZone='UTC'
        />
      </section>
    </>
  )
}

export default App
