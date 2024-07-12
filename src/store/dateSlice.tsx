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