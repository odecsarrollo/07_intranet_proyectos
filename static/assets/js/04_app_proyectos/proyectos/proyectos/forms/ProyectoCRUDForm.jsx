import React, {memo} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import BaseForm from './BaseProyectoForm';
import {useSelector} from "react-redux/es/hooks/useSelector";

const selector = formValueSelector('proyectosCRUDForm');

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
    const myValues = useSelector(state => selector(state, 'nro_automatico', ''));
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
                    myValues={myValues}
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