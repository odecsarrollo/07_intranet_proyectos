import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
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
            >
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Factor Conversion a COP'
                    name='cambio'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Variacion Precio %'
                    name='variacion'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Factor Conversion a USD'
                    name='cambio_a_usd'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Variacion Precio USD %'
                    name='variacion_usd'
                    type='number'
                />
            </MyFormTagModal>
        )
    }
}


Form = reduxForm({
    form: "categoriasProductosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;