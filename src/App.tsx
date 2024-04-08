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
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toDoList: Array<any> = [
        {
            title: 'event1',
            start: '2024-04-08'
        },
        {
            title: 'event1',
            start: '2024-04-11',
            end: '2024-04-19',
            color: 'green'
        }
    ]

    const customButtonClickEvt = useCallback(() => {
        alert('일정등록')
    }, []);

    const dateClickEvt = (arg: DateClickArg) => {
        setSelectedDate(arg.dateStr);
        setIsOpen(true);
        console.log(arg.dayEl);
    };

    const eventClickEvt = (arg: EventClickArg) => {
        arg.jsEvent.preventDefault();
        arg.view.calendar.unselect();
    };

    const closeTodoModal = () => {
      setIsOpen(false);
    }

    // const dateSelecting = (arg:DateSelectArg) => {
    //     setSelectedDate(`${arg.startStr} ~ ${arg.endStr}`);
    //     alert(`${arg.startStr} ~ ${arg.endStr}`);
    // }

  return (
    <>
      <TodoDialog isOpen={isOpen} closeTodoModal={closeTodoModal} selectedDate={selectedDate}/>
      <section className="fixed top-0 left-0 right-0 bottom-0 p-4 text-sm">
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
        // selectable={true}
        // select={dateSelecting}
        />
      </section>
    </>
  )
}

export default App
