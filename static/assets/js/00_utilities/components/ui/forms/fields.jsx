import React, {Fragment} from 'react';
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
import Combobox from 'react-widgets/lib/Combobox';
import DropdownList from 'react-widgets/lib/DropdownList';

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

const renderDropdownList = ({input, data, valueField, textField, placeholder, onSelect,dropUp}) => {
    return (
        <DropdownList {...input}
                      data={data}
                      placeholder={placeholder}
                      valueField={valueField}
                      textField={textField}
                      onChange={input.onChange}
                      onSelect={onSelect}
                      dropUp
        />
    )
};


export const MyDropdownList = (props) => {
    const {busy = false, textField = 'name', valuesField = 'id',dropUp} = props;
    return (
        <Field
            {...props}
            component={renderDropdownList}
            valueField={valuesField}
            textField={textField}
            busy={busy}
            dropUp
        />
    )
};

const renderCombobox = ({input, data, valueField, textField, placeholder, onSelect}) => {
    return (
        <Combobox {...input}
                  data={data}
                  placeholder={placeholder}
                  valueField={valueField}
                  textField={textField}
                  onChange={input.onChange}
                  onSelect={onSelect}
        />
    )
};


export const MyCombobox = (props) => {
    const {busy = false, textField = 'name', valuesField = 'id', autoFocus = false, onSelect} = props;
    return (
        <Field
            {...props}
            component={renderCombobox}
            valueField={valuesField}
            textField={textField}
            autoFocus={autoFocus}
            onSelect={onSelect}
            busy={busy}
        />
    )
};


MyCombobox.propTypes = {
    busy: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    textField: PropTypes.string,
    name: PropTypes.string,
    valuesField: PropTypes.string,
    placeholder: PropTypes.string,
    data: PropTypes.any,
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
        <Fragment>
            <DateTimePicker
                onChange={onChange}
                format="YYYY-MM-DD"
                time={false}
                max={new Date()}
                value={!value ? null : new Date(value)}
            />{show_edad && edad}
        </Fragment>
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
                   className='col-12'
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
        <Fragment>
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
        </Fragment>
    )
};
MySelectField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string,
    options: PropTypes.any
};