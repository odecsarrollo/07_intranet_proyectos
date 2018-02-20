import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyCheckboxSimple, MyTextFieldSimple} from '../../../../components/utilidades/forms/fields';
import {MyFormTag} from '../../../../components/utilidades/forms/templates';
import {connect} from "react-redux";
import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

class ColaboradorForm extends Component {
    render() {
        const {
            pristine,
            submitting,
            onSubmit,
            handleSubmit,
            reset,
            onCancel,
            onDelete,
            initialValues,
            mis_permisos
        } = this.props;

        const can_delete = tengoPermiso(mis_permisos, 'delete_colaboradorbiable');

        return (
            <MyFormTag
                nombre='Colaborador'
                onSubmit={handleSubmit(onSubmit)}
                pristine={pristine}
                submitting={submitting}
                reset={reset}
                initialValues={initialValues}
                onCancel={onCancel}
                onDelete={onDelete}
                can_delete={initialValues && can_delete && !initialValues.es_cguno}
            >

                <MyTextFieldSimple
                    className="col-md-4"
                    nombre='Cédula'
                    name='cedula'
                    case='U'/>

                <MyTextFieldSimple
                    className="col-md-4"
                    nombre='Nombres'
                    name='nombres'
                    case='U'/>

                <MyTextFieldSimple
                    className="col-md-4"
                    nombre='Apellidos'
                    name='apellidos'
                    case='U'/>

                <MyCheckboxSimple
                    className="col-md-12"
                    nombre='Autogestiona Horas'
                    name='autogestion_horas_trabajadas'/>

                <MyCheckboxSimple
                    className="col-md-12"
                    nombre='En Proyectos'
                    name='en_proyectos'/>

            </MyFormTag>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

const validate = values => {
    const errors = {};
    if (!values.nombres) {
        errors.nombres = 'Requerido';
    }
    if (!values.apellidos) {
        errors.apellidos = 'Requerido';
    }
    if (!values.cedula) {
        errors.cedula = 'Requerido';
    }

    return errors;
};

ColaboradorForm = reduxForm({
    form: "colaboradorForm",
    validate,
    enableReinitialize: true
})(ColaboradorForm);

ColaboradorForm = (connect(mapPropsToState, null)(ColaboradorForm));

export default ColaboradorForm;
