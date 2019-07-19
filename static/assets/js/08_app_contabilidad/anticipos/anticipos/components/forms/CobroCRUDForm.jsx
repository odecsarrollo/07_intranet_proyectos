import React, {memo, useState} from 'react';
import {reduxForm} from 'redux-form';
import {useDispatch} from "react-redux";
import moment from "moment-timezone";
import * as actions from '../../../../../01_actions/01_index';
import CobroFormBase from './CobroFormBase';
import MyDialogCreate from "../../../../../00_utilities/components/ui/dialog/create_dialog";

const style = {
    tabla: {
        fontSize: '0.7rem',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            td_icono: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
                minWidth: '120px'
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
        }
    }
};

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
    } = props;
    return (
        <MyDialogCreate
            element_type={`Crear ${singular_name}`}
            is_open={modal_open}
            fullScreen={true}
        >
            <CobroFormBase
                onCancel={onCancel}
                mostrar_cancelar={true}
                onSubmit={handleSubmit((v) => onSubmit(
                    {...v, fecha: moment(v.fecha).format('YYYY-MM-DD')}
                ))}
            />
        </MyDialogCreate>
    )
});

Form = reduxForm({
    form: "proformaAnticipoForm",
    enableReinitialize: true
})(Form);

export default Form;