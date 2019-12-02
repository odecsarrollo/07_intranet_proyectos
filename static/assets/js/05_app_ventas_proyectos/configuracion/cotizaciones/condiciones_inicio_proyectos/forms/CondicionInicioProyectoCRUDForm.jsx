import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCheckboxSimple,
    MyTextFieldSimple,
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    render() {
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
        } = this.props;
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
                f
            >
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Descripción'
                    name='descripcion'
                    case='U'/>
                <MyCheckboxSimple
                    className="col-6 pt-4"
                    name='require_documento'
                    label='Requiere Documento'
                />
                <MyCheckboxSimple
                    className="col-6 pt-4"
                    name='condicion_especial'
                    label='Condición Especial'
                />
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "condicionInicioProyectoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;