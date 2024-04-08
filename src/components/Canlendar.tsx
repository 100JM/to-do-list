// import { useCallback, useState } from 'react';

// import FullCalendar from '@fullcalendar/react';
// import interactionPlugin from "@fullcalendar/interaction";
// import { DateClickArg } from '@fullcalendar/interaction';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { CssDimValue, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core/index.js';
// import koLocale from '@fullcalendar/core/locales/ko';

// import TodoDialog from './TOdoDialog';

// const Calendar: React.FC = () => {
//     const calenderHeight: CssDimValue = '100%';
//     const [selectedDate, setSelectedDate] = useState<string>("");
//     const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

//     const toDoList: Array<any> = [
//         {
//             title: 'event1',
//             start: '2024-04-08'
//         },
//         {
//             title: 'event1',
//             start: '2024-04-11',
//             end: '2024-04-19',
//             color: 'green'
//         }
//     ]

//     const customButtonClickEvt = useCallback(() => {
//         alert('일정등록')
//     }, []);

//     const dateClickEvt = (arg: DateClickArg) => {
//         setSelectedDate(arg.dateStr);
//         alert(arg.dateStr);

//         console.log(arg.dayEl);
//     };

//     const eventClickEvt = (arg: EventClickArg) => {
//         arg.jsEvent.preventDefault();
//         arg.view.calendar.unselect();
//     };

//     // const dateSelecting = (arg:DateSelectArg) => {
//     //     setSelectedDate(`${arg.startStr} ~ ${arg.endStr}`);
//     //     alert(`${arg.startStr} ~ ${arg.endStr}`);
//     // }

//     return (
//         <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             editable={true}
//             height={calenderHeight}
//             locale={koLocale}
//             customButtons={{
//                 addTodoButton: {
//                     text: '일정등록',
//                     click: customButtonClickEvt,
//                 },
//             }}
//             headerToolbar={{
//                 left: 'prev,next today addTodoButton',
//                 center: 'title',
//                 right: 'dayGridMonth,dayGridWeek,dayGridDay',
//             }}
//             dateClick={dateClickEvt}
//             events={toDoList}
//             eventClick={eventClickEvt}
//         // selectable={true}
//         // select={dateSelecting}
//         />
//     )

// }

// export default Calendar;