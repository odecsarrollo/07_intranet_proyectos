import React from 'react';
import {reduxForm} from 'redux-form';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_contacto';
import ClienteDetailDashboardCRUDContactoFormBase from "./ClienteDetailDashboardCRUDContactoFormBase";


let Form = (props) => {
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
        cliente_id,
    } = props;
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => onSubmit({...v, cliente: cliente_id}))}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <ClienteDetailDashboardCRUDContactoFormBase/>
        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "contactoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;