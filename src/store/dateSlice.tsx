import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import dayjs from 'dayjs';

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
    koreaLat: number;
    koreaLng: number;
    overseasLat: number;
    overseasLng: number;
    locationName: string;
    overseaLocationName: string;
    isKorea: boolean;
    user: any;
};

interface SelectedDateEvtInferface {
    id: string;
    allDay: boolean;
    startStr: string;
    endStr: string;
    title: string;
    backgroundColor: string;
}

interface DateClickInterface {
    dateStr: string;
    selectedDateEvt: SelectedDateEvtInferface[];
}

type DateState = {
    selectedDate: SelectedDateInterface;
    selectedDateEventInfo: SelectedDateInterface;
    selectedDateEventList: Array<any>;
    todoList: Array<any>;
    myTodoList: Array<any>;
    searchedToDoList: Array<any>;
    importantEventList: Array<any>;
};

const defaultStartDate: string = new Date().toISOString();

const initDateState: DateState = {
    selectedDate: {
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
        koreaLat: 37.5665,
        koreaLng: 126.9780,
        overseasLat: 37.5665,
        overseasLng: 126.9780,
        locationName: '',
        overseaLocationName: '',
        isKorea: true,
        user: 0,
    },
    selectedDateEventInfo: {
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
        koreaLat: 37.5665,
        koreaLng: 126.9780,
        overseasLat: 37.5665,
        overseasLng: 126.9780,
        locationName: '',
        overseaLocationName: '',
        isKorea: true,
        user: 0,
    },
    selectedDateEventList: [],
    todoList: [
        {
            id: '1',
            title: 'Aevent',
            start: '2024-06-14T09:00',
            end: '2024-06-15T18:00',
            color: '#3788d8',
            colorName: '워터블루',
            allDay: false,
            important: true,
            display: "block",
            koreaLat: 37.5665,
            koreaLng: 126.9780,
            overseasLat: 37.5665,
            overseasLng: 126.9780,
            locationName: '',
            overseaLocationName: '',
            isKorea: true,
            user: 3643699604,
        },
        {
            id: '2fds',
            title: 'Cevent',
            start: '2024-07-15T09:00',
            end: '2024-07-19T10:00',
            color: '#3788d8',
            colorName: '워터블루',
            allDay: false,
            important: true,
            description: '테스트입니다.',
            display: "block",
            koreaLat: 37.5665,
            koreaLng: 126.9780,
            overseasLat: 37.5665,
            overseasLng: 126.9780,
            locationName: '',
            overseaLocationName: '',
            isKorea: true,
            user: 3643699604,
        },
        {
            id: '3a',
            title: '긴 이름의 일정이 등록되었을때 css 조정 작업이 필요합니다.',
            start: '2024-07-10',
            end: '2024-07-17',
            color: '#FA8072',
            colorName: '살몬',
            allDay: true,
            important: true,
            description: '조정 작업 완료',
            display: "block",
            koreaLat: 37.5665,
            koreaLng: 126.9780,
            overseasLat: 37.5665,
            overseasLng: 126.9780,
            locationName: '',
            overseaLocationName: '',
            isKorea: true,
            user: 123,
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
            koreaLat: 37.5665,
            koreaLng: 126.9780,
            overseasLat: 12.2529152,
            overseasLng: 109.1899018,
            locationName: '',
            overseaLocationName: '냐짱, 베트남 칸호아 냐짱',
            isKorea: false,
            user: 3643699604,
        }
    ],
    myTodoList: [],
    searchedToDoList: [],
    importantEventList: [],
};

const dateSlice = createSlice({
    name: 'date',
    initialState: initDateState,
    reducers: {
        setSelectedDate: (state) => {
            state.selectedDate = {
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
                koreaLat: 37.5665,
                koreaLng: 126.9780,
                overseasLat: 37.5665,
                overseasLng: 126.9780,
                locationName: '',
                overseaLocationName: '',
                isKorea: true,
                user: 0,
            }
        },
        dateClickEvt: (state, action: PayloadAction<DateClickInterface>) => {
            state.selectedDateEventList = action.payload.selectedDateEvt.filter((event) => {
                if (!event.allDay) {
                    return dayjs(event.startStr.split('T')[0]).format('YYYY-MM-DD') <= action.payload.dateStr
                        &&
                        action.payload.dateStr <= dayjs(event.endStr.split('T')[0]).format('YYYY-MM-DD');
                } else {
                    return dayjs(event.startStr.split('T')[0]).format('YYYY-MM-DD') <= action.payload.dateStr
                        &&
                        action.payload.dateStr < dayjs(event.endStr.split('T')[0]).format('YYYY-MM-DD');
                }
            });

            state.selectedDate.start = action.payload.dateStr;
            state.selectedDate.end = action.payload.dateStr;
        },
        getSelectedEventInfo: (state, action) => {
            state.selectedDateEventInfo = state.myTodoList.find((t) => {
                return t.id === action.payload;
            })
        },
        searchToDoEvt: (state, action) => {
            const keyword = action.payload.replace(/\s/g, '').toLowerCase();

            state.searchedToDoList = state.myTodoList.filter((t) => {
                if (keyword) {
                    if (t.title?.replace(/\s/g, '').toLowerCase().includes(keyword) || t.description?.replace(/\s/g, '').toLowerCase().includes(keyword)) {
                        return t;
                    }
                }
            }).sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        },
        getImportantTodoList: (state) => {
            state.importantEventList = state.myTodoList.filter((t) => {
                return t.important === true;
            }).sort((a, b) => {
                const dateA = new Date(a.end.split('T')[0]);
                const dateB = new Date(b.end.split('T')[0]);

                return dateA.getTime() - dateB.getTime();
            });
        },
        addNewTodo: (state, action: PayloadAction<object>) => {
            state.myTodoList.push(action.payload);
        },
        updateTodo: (state, action: PayloadAction<SelectedDateInterface>) => {
            state.myTodoList = state.myTodoList.map((i) => {
                if (i.id === action.payload.id) {
                    return action.payload;
                }

                return i;
            })
        },
        deleteTodo: (state, action) => {
            state.myTodoList = state.myTodoList.filter((t) => {
                return t.id !== action.payload;
            });
        },
        setSelectedEventInfoDefault: (state, action: PayloadAction<SelectedDateInterface>) => {
            state.selectedDateEventInfo = action.payload;
        },
        getMyTodoList: (state, action) => {
            state.myTodoList = state.todoList.filter((t) => {
                return t.user === action.payload;
            });
        },
    },
});

export const dateAction = dateSlice.actions;
export default dateSlice.reducer;