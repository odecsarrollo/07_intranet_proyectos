import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {
    SelectField
} from 'redux-form-material-ui'
import {connect} from "react-redux";

import {MyTextFieldSimple} from '../../../components/utilidades/forms/fields';
import {MyFormTag} from '../../../components/utilidades/forms/templates';
import {REGEX_SOLO_NUMEROS} from '../../../components/utilidades/common';

class HoraHojaTrabajoDiarioForm extends Component {
    renderSelectItem(item) {
        return (
            <MenuItem key={item.id} value={item.id}
                      primaryText={`${item.id_literal} - ${item.descripcion}`}/>
        )
    }

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
            can_delete,
            literales_lista
        } = this.props;
        return (
            <MyFormTag
                nombre='Tiempo'
                onSubmit={handleSubmit(onSubmit)}
                pristine={pristine}
                submitting={submitting}
                reset={reset}
                initialValues={initialValues}
                onCancel={onCancel}
                onDelete={onDelete}
                can_delete={initialValues && can_delete && !initialValues.es_cguno}
            >
                <div className="col-12 col-md-9">
                    <Field
                        fullWidth={true}
                        name="literal"
                        component={SelectField}
                        hintText="Literal Op"
                        floatingLabelText="Literal Op"
                    >
                        {
                            _.map(_.sortBy(literales_lista, ['id_literal']), (literal) => {
                                return (this.renderSelectItem(literal))
                            })
                        }
                    </Field>
                </div>
                <MyTextFieldSimple
                    className="col-md-3"
                    nombre='Minutos'
                    name='cantidad_minutos'
                    case='U'/>
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
    if (!values.literal) {
        errors.literal = 'Requerido';
    }
    if (!values.cantidad_minutos) {
        errors.cantidad_minutos = 'Requerido';
    } else {
        if (values.cantidad_minutos < 1) {
            errors.cantidad_minutos = 'Minutos deben de ser mayores a cero';
        }
        if (!REGEX_SOLO_NUMEROS.test(values.cantidad_minutos)) {
            errors.cantidad_minutos = 'Debe ser solamente números enteros';
        }
    }
    return errors;
};

HoraHojaTrabajoDiarioForm = reduxForm({
    form: "horaHojaTrabajoDiarioForm",
    validate,
    enableReinitialize: true
})(HoraHojaTrabajoDiarioForm);

HoraHojaTrabajoDiarioForm = (connect(mapPropsToState, null)(HoraHojaTrabajoDiarioForm));

export default HoraHojaTrabajoDiarioForm;
