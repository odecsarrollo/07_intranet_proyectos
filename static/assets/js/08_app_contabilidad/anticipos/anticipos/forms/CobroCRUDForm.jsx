import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import moment from "moment-timezone";
import CobroFormBase from './CobroFormBase';
import MyDialogCreate from "../../../../00_utilities/components/ui/dialog/create_dialog";

let Form = memo(props => {
    const {
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