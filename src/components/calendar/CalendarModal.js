import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  Modal.setAppElement('#root');

  const now = moment().minutes(0).seconds(0).add(1, 'hours');
  const nowPlus1 = now.clone().add(1, 'hours');

  const initEvent = {
    title:'',
    notes:'',
    start: now.toDate(),
    end: nowPlus1.toDate()
}


export const CalendarModal = () => {

    const dispatch = useDispatch();

    const [dateStart, setdateStart] = useState(now.toDate());
    const [dateEnd, setdateEnd] = useState(nowPlus1.toDate());
    const [titleValid, settitleValid] = useState( true );

    //Esta pendiente de algo del store
    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);

    const [formValue, setformValue] = useState( initEvent );

    const {title , notes, start , end} = formValue;


    useEffect(() => {
        if(activeEvent){
            setformValue(activeEvent);
        }else{
            setformValue(initEvent);
        }

    }, [activeEvent,setformValue]);

    const handleStartDateChange = ( e ) => {
        setdateStart( e );
        setformValue({
            ...formValue,
            start: e
        });
    }
    
    const handleEndDateChange = ( e ) => {
        setdateEnd( e );
        setformValue({
            ...formValue,
            end: e
        });
    }

    const closeModal = () => {
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
        setformValue( initEvent );
    }

    const handleInputChange = ({target}) => {
        setformValue({
            ...formValue,
            [target.name]: target.value
        });
    }

    const handleSubmitForm = ( e ) => {
        e.preventDefault();

        const momentStart = moment( dateStart );
        const momentEnd = moment( dateEnd );

        if(momentStart.isSameOrAfter(momentEnd)){
            return Swal.fire('Error','La fecha fin debe ser mayor a la fecha de inicio', 'error');
        }

        if (title.trim().length < 2){
            return settitleValid(false);
        }

        //TODO: grabar en bd
        if(activeEvent){
            dispatch(eventUpdated(formValue));
        }else{
            dispatch(eventAddNew({
                ...formValue,
                id: new Date().getTime(),
                user: {
                    _id:'123',
                    name: 'Alvaro'
                }
            }));
            
        }

        
        settitleValid(true);
        closeModal();

        
    }


    return (
        <div>
            <Modal
            isOpen={ modalOpen }
            onRequestClose={ closeModal }
            style={ customStyles }
            closeTimeoutMS={ 200 }
            overlayClassName="modal-fondo"
            className="modal"
            >

            <h1> {(activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
            <hr />
            <form 
            className="container"
            onSubmit={handleSubmitForm}>

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={ handleStartDateChange }
                        value={ start }
                        className = "form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={ handleEndDateChange }
                        value={ end }
                        className = "form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        minDate={ start }
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={ `form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange= { handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange= { handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>

            </Modal>
            
        </div>
    )
}
 