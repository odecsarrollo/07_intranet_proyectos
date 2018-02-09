import React from 'react';
import {upper, lower} from "./common";
import {Field} from 'redux-form';
import PropTypes from "prop-types";
import {
    TextField
} from 'redux-form-material-ui'
import {
    Checkbox
} from 'redux-form-material-ui'

export const MyTextFieldSimple = (props) => {
    let normalize = null;
    if (props.case === 'U') {
        normalize = upper
    } else if (props.case === 'L') {
        normalize = lower
    }
    return (
        <div className={props.className}>
            <Field
                fullWidth={true}
                name={props.name}
                component={TextField}
                hintText={props.nombre}
                autoComplete="off"
                floatingLabelText={props.nombre}
                normalize={normalize}
            />
        </div>
    )
};
MyTextFieldSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};


export const MyCheckboxSimple = (props) => {
    let normalize = null;
    if (props.case === 'U') {
        normalize = upper
    } else if (props.case === 'L') {
        normalize = lower
    }
    return (
        <div className={props.className}>
            <Field
                name={props.name}
                component={Checkbox}
                label={props.nombre}
                normalize={v => !!v}
            />
        </div>
    )
};
MyCheckboxSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};


