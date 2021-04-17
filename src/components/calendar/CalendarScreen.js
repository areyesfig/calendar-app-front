import React, { useState } from 'react'
import  {Navbar}  from "../ui/Navbar";
import {Calendar, momentLocalizer} from 'react-big-calendar';
import { CalendarEvent } from './CalendarEvent';
import moment from 'moment';
import { messages } from '../../helpers/calendar-messages';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import {uiOpenModal} from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeletedEventFab } from '../ui/DeletedEventFab';
moment.locale('es');

const localizer = momentLocalizer(moment);


export const CalendarScreen = () => {

    const dispatch = useDispatch();
    //TODO:Leer los eventos del store

    const {events,activeEvent} = useSelector(state => state.calendar);

    const [lastView, setlastView] = useState(localStorage.getItem('lastView') || 'moth');
    
    const onDoubleClickEvent = (e) => {
       dispatch(uiOpenModal());
    }

    const onSelectedEvent = (e) => {
        dispatch(eventSetActive(e));

    }

    const onViewChange = (e) => {
        setlastView(e);
        localStorage.setItem('lastView',e);
    }

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    }


    const eventStyleGetter = ( event,start,end,isSelected ) => {

        const style = {
            backgroundColor:'#367CF7',
            borderRadius:'0px',
            opacity:0.8,
            display:'block',
            color:'white'
        }

        return {
            style
        }
    };

    return (
        <div className="calendar-screen">
            <Navbar/>
            <Calendar
            localizer={localizer}
            events={ events }
            startAccessor="start"
            endAccessor="end"
            messages= { messages }
            eventPropGetter= {eventStyleGetter}
            onDoubleClickEvent={ onDoubleClickEvent }
            onView = { onViewChange }
            onSelectEvent = { onSelectedEvent }
            onSelectSlot = { onSelectSlot }
            selectable = {true}
            components={{
                events: CalendarEvent
            }}
            view={ lastView }
    />

       
        <AddNewFab/>
        {
            (activeEvent) && <DeletedEventFab/> 
        }
       

        <CalendarModal/>
        </div>
    )
}
