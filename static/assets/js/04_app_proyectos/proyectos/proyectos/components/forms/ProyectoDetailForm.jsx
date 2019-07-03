import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import BaseFormProyecto from './base_form';
import validate from './validate';

let Form = memo((props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        handleSubmit,
        onSubmit,
        onCancel,
        permisos_object,
        clientes_list,
    } = props;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseFormProyecto
                clientes_list={clientes_list}
                initialValues={initialValues}
                permisos_object={permisos_object}
            />
            <BotoneriaModalForm
                onCancel={onCancel}
                pristine={pristine}
                reset={reset}
                submitting={submitting}
                initialValues={initialValues}
                conCerrar={false}
            />
        </form>
    )
});

Form = reduxForm({
    form: "proyectoEditForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;