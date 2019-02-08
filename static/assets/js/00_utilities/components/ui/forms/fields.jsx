import React, {Fragment} from 'react';
import {upper, lower} from "../../../common";
import {Field} from 'redux-form';
import PropTypes from "prop-types";

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';
import DropdownList from 'react-widgets/lib/DropdownList';
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

const renderInputField = (field) => {
    return (
        <Fragment>
            <input
                {...field.input}
                type="file"
                value={null}
            />
            {field.meta.touched && field.meta.error &&
            <span className='form-field-error'>{field.meta.error}</span>}
        </Fragment>
    )
};

export const MyFieldFileInput = (props) => {
    return (
        <div className={props.className}>
            <Field
                {...props}
                component={renderInputField}
            />
        </div>
    )
};

const renderTextField = ({input, label, meta: {touched, error, warning}, ...custom}) => {
    let new_custom = custom;
    if (touched && error) {
        new_custom = {...custom, helperText: error}
    }
    return (
        <Fragment>
            <TextField
                label={label}
                margin="normal"
                error={error && touched}
                {...input}
                {...new_custom}
            />
        </Fragment>
    )
};
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
            label={props.nombre}
            name={props.name}
            helperText={props.helperText}
            {...props}
            component={renderTextField}
            autoComplete="off"
            normalize={normalize}
        />
    )
};
MyTextFieldSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};

const renderDropdownList = ({input, data, valueField, textField, placeholder, onSelect}) => {
    return (
        <DropdownList {...input}
                      data={data}
                      placeholder={placeholder}
                      valueField={valueField}
                      textField={textField}
                      onChange={input.onChange}
                      onSelect={onSelect}
        />
    )
};


export const MyDropdownList = (props) => {
    const {busy = false, textField = 'name', valuesField = 'id', className, label = null} = props;
    return (
        <div className={`${className}`}>
            {
                label &&
                <label>{label}</label>
            }
            <Field
                {...props}
                component={renderDropdownList}
                valueField={valuesField}
                textField={textField}
                busy={busy}
                dropUp
            />
        </div>
    )
};
const renderCombobox = ({input, data, valueField, textField, placeholder, onSelect, meta: {touched, error, warning}}) => {
    return (
        <Fragment>
            <Combobox {...input}
                      data={data}
                      placeholder={placeholder}
                      valueField={valueField}
                      textField={textField}
                      onChange={e => {
                          input.onChange(typeof(e) === 'string' ? e : e[valueField]);
                      }}
                      onSelect={onSelect}
                      onBlur={() => input.onBlur()}
            />
            {touched && ((error && <span className='form-field-error'>{error}</span>) || (warning &&
                <span>{warning}</span>))}
        </Fragment>
    )
};

export const MyCombobox = (props) => {
    const {busy = false, textField = 'name', valuesField = 'id', autoFocus = false, onSelect, className} = props;
    return (
        <div className={`${className} mt-4`}>
            <Field
                {...props}
                component={renderCombobox}
                valueField={valuesField}
                textField={textField}
                autoFocus={autoFocus}
                onChange={v => v[valuesField]}
                onSelect={onSelect}
                busy={busy}
            />
        </div>
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

const renderCheckbox = ({input, label}) => (
    <FormControlLabel
        control={
            <Checkbox
                checked={input.value}
                color='primary'
                onChange={(event, value) => input.onChange(value)}
            />
        }
        label={label}
    />
);

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
            component={renderCheckbox}
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

const renderDateTimePicker = ({input: {onChange, value}, meta: {touched, error}, show_edad, max = new Date(), min = new Date(1900, 0, 1)}) => {
    const now = moment().tz('America/Bogota');
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
                max={max}
                min={min}
                value={!value ? null : moment(value).toDate()}
            />{show_edad && edad}
            {touched && (error && <span className='form-field-error'>{error}</span>)}
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


const renderSelect = ({input, nombre, name, options}) => (
    <FormControl fullWidth={true}>
        <InputLabel htmlFor={`select-${input.name}`}>
            {nombre}
        </InputLabel>
        <Select
            {...input}
            inputProps={{
                id: `select-${input.name}`,
            }}
        >
            {options.map(o => {
                return (
                    <MenuItem
                        key={o.value}
                        value={o.value}
                    >
                        {o.primaryText}
                    </MenuItem>
                )
            })}
        </Select>
    </FormControl>
);


export const MySelectField = (props) => {
    return (
        <Field
            options={props.options}
            fullWidth={true}
            name={props.name}
            nombre={props.nombre}
            component={renderSelect}
        />
    )
};
MySelectField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string,
    options: PropTypes.any
};

const renderRadioGroup = ({input, nombre, meta, options, required = false, meta: {touched, error}, ...rest}) => {
    return (
        <FormControl component="fieldset" error={error && touched} required={required}>
            <FormLabel component="legend">{nombre}</FormLabel>
            <RadioGroup
                aria-label="gender"
                name={nombre}
                value={input.value}
                onChange={(event, value) => input.onChange(value)}
            >
                {options.map(o => {
                    return (
                        <FormControlLabel key={o.label} value={o.value} control={<Radio/>} label={o.label}/>
                    )
                })}
            </RadioGroup>
        </FormControl>
    )
}

export const MyRadioButtonGroup = (props) => {
    return (
        <Field
            name={props.name}
            {...props}
            className='col-12'
            fullWidth={true}
            required={props.required}
            component={renderRadioGroup}>
        </Field>
    )
};
MyRadioButtonGroup.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string,
    options: PropTypes.any
};