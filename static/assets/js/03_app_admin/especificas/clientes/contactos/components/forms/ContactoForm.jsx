import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import ContactoFormBase from "./ContactoFormBase";


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
            singular_name,
            object,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => onSubmit({...v, cliente: object.id}))}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <ContactoFormBase/>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "contactoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;