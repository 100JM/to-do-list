import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import dayjs from 'dayjs';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventApi } from '@fullcalendar/core/index.js';

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
    lat: number;
    lng: number;
    locationName: string;
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
        lat: 37.5665,
        lng: 126.9780,
        locationName: ''
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
        lat: 37.5665,
        lng: 126.9780,
        locationName: ''
    },
    selectedDateEventList: [],
    todoList: [
        {
            id: '1',
            title: 'Aevent',
            start: '2024-06-08T09:00',
            end: '2024-06-09T18:00',
            color: '#3788d8',
            colorName: '워터블루',
            allDay: false,
            important: false,
            display: "block"
        },
        {
            id: '2',
            title: 'Cevent',
            start: '2024-06-10T09:00',
            end: '2024-06-10T10:00',
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
            start: '2024-06-10',
            end: '2024-06-11',
            color: '#FA8072',
            colorName: '살몬',
            allDay: true,
            important: false,
            description: '조정 작업 완료',
            display: "block"
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
            lat: 12.2529152,
            lng: 109.1899018,
            locationName: '냐짱, 베트남 칸호아 냐짱'
        }
    ]
};

const dateSlice = createSlice({
    name: 'date',
    initialState: initDateState,
    reducers: {
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

            state.selectedDate = {
                id: '',
                title: '',
                allDay: true,
                start: action.payload.dateStr,
                end: action.payload.dateStr,
                color: '#3788d8',
                colorName: '워터블루',
                description: '',
                important: false,
                display: 'block',
                lat: 37.5665,
                lng: 126.9780,
                locationName: ''
            };
        }
    },
});

export const dateAction = dateSlice.actions;
export default dateSlice.reducer;