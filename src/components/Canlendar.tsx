
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CssDimValue } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

const Calendar: React.FC = () => {
    const calenderHeight: CssDimValue = '100%';

    const customButtonClickEvt = () => {
        alert('일정등록')
    };
    
    const dateClickEvt = (arg:DateClickArg) => {
        alert(arg.dateStr);
    };

    return (
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
        />
    )

    // headerToolbar={headerToolbarOptions} 이용해서 커스텀 컴포넌트 추가하기
}

export default Calendar;