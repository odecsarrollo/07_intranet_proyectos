import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import validate from './validate';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';


class sistemaInformacionOrigenForm extends Component {
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
        } = this.props;
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
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Codigo Amarre'
                    name='codigo_amarre'
                    case='U'/>

            </MyFormTagModal>
        )
    }
}

sistemaInformacionOrigenForm = reduxForm({
    form: "sistemaInformacionOrigenForm",
    validate: validate,
    enableReinitialize: true
})(sistemaInformacionOrigenForm);

export default sistemaInformacionOrigenForm;