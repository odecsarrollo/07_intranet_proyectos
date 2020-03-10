import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

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
        singular_name
    } = props;
    const editable = !initialValues || (initialValues && !initialValues.sincronizado_sistema_informacion);
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {!initialValues && <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Id'
                name='new_id'
                case='U'/>}
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Descripcion'
                disabled={!editable}
                name='descripcion'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Decimales'
                disabled={!editable}
                name='decimales'
                type='number'/>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "unidadMedidaForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;