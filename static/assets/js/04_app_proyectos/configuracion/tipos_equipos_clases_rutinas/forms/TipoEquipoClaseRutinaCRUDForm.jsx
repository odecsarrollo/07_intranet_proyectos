import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

let TipoEquipoClaseRutinaCRUDForm = memo(props => {
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
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Mes'
                name='mes'
                type='number'
            />
        </MyFormTagModal>
    )
});

TipoEquipoClaseRutinaCRUDForm = reduxForm({
    form: "tipoEquipoRutinaCRUDForm",
    validate: validate,
    enableReinitialize: true
})(TipoEquipoClaseRutinaCRUDForm);

export default TipoEquipoClaseRutinaCRUDForm;