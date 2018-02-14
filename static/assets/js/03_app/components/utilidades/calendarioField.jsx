import React from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import PropTypes from "prop-types";

import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);


const CalendarField = (props) => {
    const {className, nombre, onChange, value, max, min} = props;
    return (
        <div className={className}>
            <label>{nombre}</label>
            <DateTimePicker
                onChange={onChange}
                format="YYYY-MM-DD"
                time={false}
                max={max ? max : new Date()}
                value={!value ? null : new Date(value)}
            />
        </div>
    )
};

CalendarField.propTypes = {
    nombre: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func
};

export default CalendarField;