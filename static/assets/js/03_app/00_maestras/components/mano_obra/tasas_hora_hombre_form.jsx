import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import MenuItem from 'material-ui/MenuItem';
import {
    TextField,
    SelectField
} from 'redux-form-material-ui'
import {connect} from "react-redux";

import momentLocaliser from 'react-widgets-moment';

import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

import BotoneriaForm from "../../../components/utilidades/forms/botoneria_form";

const upper = value => value && value.toUpperCase();

class TasaHoraHombreForm extends Component {
    renderSelectItem(item) {
        return (
            <MenuItem key={item.id} value={item.id} primaryText={`${item.nombres} ${item.apellidos}`}/>
        )
    }

    renderDateTimePicker({input: {onChange, value}, showTime}) {
        const now = moment();
        return (
            <div>
                <DateTimePicker
                    onChange={onChange}
                    format="YYYY-MM-DD"
                    time={false}
                    value={!value ? null : new Date(value)}
                />
            </div>
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
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h5 className="h5-responsive mt-2">{initialValues ? 'Editar ' : 'Crear '} Tasa</h5>
                    <div className="row">
                        {/*<div className="col-12 col-md-6">*/}
                        {/*<label>Fecha Nacimiento</label>*/}
                        {/*<Field*/}
                        {/*name="fecha"*/}
                        {/*type="date"*/}
                        {/*fullWidth={true}*/}
                        {/*label="Fecha Tasa"*/}
                        {/*component={this.renderDateTimePicker}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        <div className="col-12">
                            <Field
                                fullWidth={true}
                                name="colaborador"
                                component={SelectField}
                                hintText="Colaborador"
                                floatingLabelText="Colaborador"
                            >
                                {
                                    _.map(_.sortBy(colaboradores, ['nombres','apelli', 'mes']), (colaborador) => {
                                        return (this.renderSelectItem(colaborador))
                                    })
                                }
                            </Field>
                        </div>

                        <div className="col-12 col-md-4 col-lg-3">
                            <Field
                                fullWidth={true}
                                name="ano"
                                component={TextField}
                                hintText="Año"
                                autoComplete="off"
                                floatingLabelText="Año"
                            />
                        </div>

                        <div className="col-12 col-md-4 col-lg-3">
                            <Field
                                fullWidth={true}
                                name="mes"
                                component={TextField}
                                hintText="Mes"
                                autoComplete="off"
                                floatingLabelText="Mes"
                            />
                        </div>

                        <div className="col-12 col-md-4 col-lg-3">
                            <Field
                                fullWidth={true}
                                name="costo_hora"
                                component={TextField}
                                hintText="Costo Hora"
                                autoComplete="off"
                                floatingLabelText="Costo Hora"
                            />
                        </div>

                        <BotoneriaForm
                            texto_botones='Tasa'
                            pristine={pristine}
                            submitting={submitting}
                            reset={reset}
                            initialValues={initialValues}
                            onCancel={onCancel}
                            onDelete={onDelete}
                            can_delete={can_delete}
                        />
                    </div>
                </div>
            </form>
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
        let re = /^-{0,1}\d*\.{0,1}\d+$/;
        if (!re.test(values.costo_hora)) {
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
