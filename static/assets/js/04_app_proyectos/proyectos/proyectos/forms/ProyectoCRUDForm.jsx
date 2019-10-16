import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import BaseForm from './BaseProyectoForm';

let ProyectosCRUDForm = memo(props => {
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
        permisos_object,
        clientes_list
    } = props;
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <div className="m-2">
                <BaseForm
                    clientes_list={clientes_list}
                    permisos_object={permisos_object}
                    initialValues={initialValues}
                />
            </div>
        </MyFormTagModal>
    )
});

ProyectosCRUDForm = reduxForm({
    form: "proyectosCRUDForm",
    validate,
    enableReinitialize: true
})(ProyectosCRUDForm);

export default ProyectosCRUDForm;