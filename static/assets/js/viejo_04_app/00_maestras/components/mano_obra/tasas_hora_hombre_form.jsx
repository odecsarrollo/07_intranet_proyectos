import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {MyTextFieldSimple} from '../../../components/utilidades/forms/fields';
import {REGEX_SOLO_NUMEROS_DINERO} from '../../../components/utilidades/common';
import {
    SelectField
} from 'redux-form-material-ui'
import {connect} from "react-redux";
import {MyFormTag} from '../../../components/utilidades/forms/templates';

class TasaHoraHombreForm extends Component {
    renderSelectItem(item) {
        return (
            <MenuItem key={item.id} value={item.id} primaryText={`${item.nombres} ${item.apellidos}`}/>
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
            colaboradores
        } = this.props;

        return (
            <MyFormTag
                nombre='Tasa'
                onSubmit={handleSubmit(onSubmit)}
                pristine={pristine}
                submitting={submitting}
                reset={reset}
                initialValues={initialValues}
                onCancel={onCancel}
                onDelete={onDelete}
                can_delete={can_delete}
            >
                <div className="col-12">
                    {!initialValues ?
                        <Field
                            fullWidth={true}
                            name="colaborador"
                            component={SelectField}
                            hintText="Colaborador"
                            floatingLabelText="Colaborador"
                        >
                            {
                                _.map(_.sortBy(colaboradores, ['nombres', 'apellidos', 'mes']), (colaborador) => {
                                    return (this.renderSelectItem(colaborador))
                                })
                            }
                        </Field> :
                        <span>{initialValues.colaborador_nombre}</span>
                    }
                </div>
                {!initialValues ?
                    <MyTextFieldSimple nombre='Año' name='ano' className='col-md-4 col-lg-3'/> :
                    <div className="col-12 col-md-4 col-lg-3">
                        <span><strong>Año: </strong>{initialValues.ano}</span>
                    </div>
                }
                {!initialValues ?
                    <MyTextFieldSimple nombre='Mes' name='mes' className='col-md-4 col-lg-3'/> :
                    <div className="col-12 col-md-4 col-lg-3">
                        <span><strong>Mes: </strong> {initialValues.mes}</span>
                    </div>
                }
                <MyTextFieldSimple nombre='Costo Hora' name='costo_hora' className='col-md-4 col-lg-3'/>
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
    if (!values.ano) {
        errors.ano = 'Requerido';
    } else {
        if (!(values.ano > 1990 && values.ano < 3000)) {
            errors.ano = 'Error en el año, debe tener 4 dígitos';
        }
    }

    if (!values.mes) {
        errors.mes = 'Requerido';
    } else {
        if (!(values.mes >= 1 && values.mes <= 12)) {
            errors.mes = 'Error en el mes, debe estar entre 1 y 12';
        }
    }

    if (!values.costo_hora) {
        errors.costo_hora = 'Requerido';
    } else {
        if (values.costo_hora < 0) {
            errors.costo_hora = 'El costo de la tasa debe de ser positivo';
        }
        if (!REGEX_SOLO_NUMEROS_DINERO.test(values.costo_hora)) {
            errors.costo_hora = 'Debe ser solamente números';
        }
    }


    return errors;
};

TasaHoraHombreForm = reduxForm({
    form: "tasaHoraHombreForm",
    validate,
    enableReinitialize: true
})(TasaHoraHombreForm);

TasaHoraHombreForm = (connect(mapPropsToState, null)(TasaHoraHombreForm));

export default TasaHoraHombreForm;
