import { useCallback, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CssDimValue, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

import TodoDialog from './components/TOdoDialog';

function App() {
  const calenderHeight: CssDimValue = '100%';
  const defaultStartDate:string = new Date().toISOString();
  
  const [selectedDate, setSelectedDate] = useState<{ startDate: string; endDate: string; }>({
    startDate: defaultStartDate,
    endDate: defaultStartDate
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toDoList: Array<any> = [
    {
      title: 'event1',
      start: '2024-04-08'
    },
    {
      title: 'event1',
      start: '2024-04-10',
      end: '2024-04-10',
    },
    {
      title: 'event1',
      start: '2024-04-11T15:00:00.000Z',
      end: '2024-04-19T11:30:00',
      color: '#FA8072'
    }
  ]

  const customButtonClickEvt = useCallback(() => {
    alert('일정등록')
  }, []);

  const dateClickEvt = (arg: DateClickArg) => {
    setSelectedDate((prevDate) => {
      return {
        ...prevDate,
        startDate: arg.dateStr,
        endDate: arg.dateStr
      }
    })

    setIsOpen(true);
    // console.log(arg.allDay);
    // console.log(arg.date.toISOString());
    // console.log(arg.dateStr);
  };

  const eventClickEvt = (arg: EventClickArg) => {
    arg.jsEvent.preventDefault();
    arg.view.calendar.unselect();
  };

  const closeTodoModal = () => {
    setIsOpen(false);
  }

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
      {isOpen && <TodoDialog isOpen={isOpen} closeTodoModal={closeTodoModal} selectedDate={selectedDate} setStartDate={setStartDate} setEndDate={setEndDate}/>}
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
        />
      </section>
    </>
  )
}

export default App
