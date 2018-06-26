import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
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
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Nombres'
                    name='nombres'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Apellidos'
                    name='apellidos'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Telefono'
                    name='telefono'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Telefono 2'
                    name='telefono_2'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Correo'
                    name='correo_electronico'
                    case='U'/>
                <div className="col-12">
                    <div className="row">
                        <MyTextFieldSimple
                            className="col-12 col-md-6"
                            nombre='Pais'
                            name='pais'
                            case='U'/>
                        <MyTextFieldSimple
                            className="col-12 col-md-6"
                            nombre='Ciudad'
                            name='ciudad'
                            case='U'/>
                    </div>
                </div>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Correo 2'
                    name='correo_electronico_2'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Cargo'
                    name='cargo'
                    case='U'/>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "algoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;