
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CssDimValue } from '@fullcalendar/core/index.js';
import koLocale from '@fullcalendar/core/locales/ko';

const Calender: React.FC = () => {
    const calenderHeight: CssDimValue = '100%';

    return (
        <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height={calenderHeight}
                locale={koLocale}
        />
    )

    // headerToolbar={headerToolbarOptions} 이용해서 커스텀 컴포넌트 추가하기
}

export default Calender;