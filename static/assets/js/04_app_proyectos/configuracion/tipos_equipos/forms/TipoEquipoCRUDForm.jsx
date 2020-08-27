import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCheckboxSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';


let TipoEquipoCRUDForm = memo(props => {
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
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyCheckboxSimple
                className="col-12"
                nombre='Activo'
                name='activo'
            />
        </MyFormTagModal>
    )
});

TipoEquipoCRUDForm = reduxForm({
    form: "tipoEquipoCRUDForm",
    validate: validate,
    enableReinitialize: true
})(TipoEquipoCRUDForm);

export default TipoEquipoCRUDForm;