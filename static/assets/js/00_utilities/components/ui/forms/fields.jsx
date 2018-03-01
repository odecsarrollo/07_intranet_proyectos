import React from 'react';
import {upper, lower} from "../../../common";
import {Field} from 'redux-form';
import PropTypes from "prop-types";
import RadioButton from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import {
    TextField,
    Checkbox,
    RadioButtonGroup,
    SelectField
} from 'redux-form-material-ui'
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

export const MyTextFieldSimple = (props) => {
    let normalize = null;
    if (props.case === 'U') {
        normalize = upper
    } else if (props.case === 'L') {
        normalize = lower
    }
    return (
        <Field
            fullWidth={true}
            name={props.name}
            {...props}
            component={TextField}
            hintText={props.nombre}
            autoComplete="off"
            floatingLabelText={props.nombre}
            normalize={normalize}
        />
    )
};
MyTextFieldSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};


export const MyCheckboxSimple = (props) => {
    const {onClick} = props;
    return (
        <Field
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}
            {...props}
            name={props.name}
            component={Checkbox}
            label={props.nombre}
            normalize={v => !!v}
        />
    )
};
MyCheckboxSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};

const renderDateTimePicker = ({input: {onChange, value}, show_edad}) => {
    const now = moment();
    const fechaHoy = moment(now, "YYYY MM DD", "es");
    const fecha_nacimiento = moment(value, "YYYY MM DD", "es").tz('America/Bogota');
    const diferencia = fechaHoy.diff(fecha_nacimiento, "years");
    const edad = `${diferencia} años`;

    return (
        <div>
            <DateTimePicker
                onChange={onChange}
                format="YYYY-MM-DD"
                time={false}
                max={new Date()}
                value={!value ? null : new Date(value)}
            />{show_edad && edad}
        </div>
    )
};

export const MyDateTimePickerField = (props) => {
    return (
        <div className={props.className}>
            <label>{props.nombre}</label>
            <Field
                name={props.name}
                type="date"
                fullWidth={true}
                label={props.nombre}
                {...props}
                component={renderDateTimePicker}
            />
        </div>
    )
};

MyDateTimePickerField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};


export const MyRadioButtonGroup = (props) => {
    return (
        <div className={props.className}>
            <label>{props.nombre}</label>
            <Field name={props.name}
                   {...props}
                   component={RadioButtonGroup}
                   fullWidth={true}
            >
                {props.options.map(o => {
                    return (
                        <RadioButton
                            key={o.label}
                            value={o.value}
                            label={o.label}
                        />
                    )
                })}
            </Field>
        </div>
    )
};
MyRadioButtonGroup.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string,
    options: PropTypes.any
};


export const MySelectField = (props) => {
    return (
        <Field
            {...props}
            fullWidth={true}
            name={props.name}
            component={SelectField}
            hintText={props.nombre}
            floatingLabelText={props.nombre}
        >
            {props.options.map(o => {
                return (
                    <MenuItem
                        key={o.value}
                        value={o.value}
                        primaryText={o.primaryText}
                    />
                )
            })}
        </Field>
    )
};
MySelectField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string,
    options: PropTypes.any
};