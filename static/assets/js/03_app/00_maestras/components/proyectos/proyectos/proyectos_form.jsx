import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {REGEX_SOLO_NUMEROS} from '../../../../components/utilidades/forms/common';
import {MyCheckboxSimple, MyTextFieldSimple} from '../../../../components/utilidades/forms/fields';
import {MyFormTag} from '../../../../components/utilidades/forms/templates';
import {connect} from "react-redux";
import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

class ProyectoForm extends Component {
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
            mis_permisos,
            cantidad_literales
        } = this.props;

        const can_delete = tengoPermiso(mis_permisos, 'delete_proyecto');
        const can_see_costo_presupuestado = tengoPermiso(mis_permisos, 'costo_presupuestado_proyecto');
        const can_see_valor = tengoPermiso(mis_permisos, 'valor_proyecto');

        return (
            <MyFormTag
                nombre='Proyecto'
                onSubmit={handleSubmit(onSubmit)}
                pristine={pristine}
                submitting={submitting}
                reset={reset}
                initialValues={initialValues}
                onCancel={onCancel}
                onDelete={onDelete}
                can_delete={can_delete && cantidad_literales === 0}
            >
                {cantidad_literales === 0 || !initialValues ?
                    <MyTextFieldSimple
                        className="col-md-4 col-lg-3"
                        nombre='OP Proyecto'
                        name='id_proyecto'
                        case='U'/> :
                    <div className="col-md-4 col-lg-3">
                        <span>{initialValues.id_proyecto}</span>
                    </div>
                }
                {
                    can_see_costo_presupuestado &&
                    <MyTextFieldSimple
                        className="col-md-4 col-lg-3"
                        nombre='Costo Presupuestado'
                        name='costo_presupuestado'/>
                }
                {
                    can_see_valor &&
                    <MyTextFieldSimple
                        className="col-md-4 col-lg-3"
                        nombre='Precio'
                        name='valor_cliente'
                        case='U'/>

                }
                <MyCheckboxSimple
                    className="col-md-4 col-lg-3"
                    nombre='Abierto'
                    name='abierto'/>

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
    if (!values.id_proyecto) {
        errors.id_proyecto = 'Requerido';
    }

    if (!values.costo_presupuestado) {
        errors.costo_presupuestado = 'Requerido';
    } else {
        if (values.costo_presupuestado < 0) {
            errors.costo_presupuestado = 'El costo presupuestado debe de ser positivo';
        }
        if (!REGEX_SOLO_NUMEROS.test(values.costo_presupuestado)) {
            errors.costo_presupuestado = 'Debe ser solamente números';
        }
    }

    if (!values.valor_cliente) {
        errors.valor_cliente = 'Requerido';
    } else {
        if (values.valor_cliente < 0) {
            errors.valor_cliente = 'El precio debe de ser positivo';
        }
        if (!REGEX_SOLO_NUMEROS.test(values.valor_cliente)) {
            errors.valor_cliente = 'Debe ser solamente números';
        }
    }

    return errors;
};

ProyectoForm = reduxForm({
    form: "proyectoForm",
    validate,
    enableReinitialize: true
})(ProyectoForm);

ProyectoForm = (connect(mapPropsToState, null)(ProyectoForm));

export default ProyectoForm;
