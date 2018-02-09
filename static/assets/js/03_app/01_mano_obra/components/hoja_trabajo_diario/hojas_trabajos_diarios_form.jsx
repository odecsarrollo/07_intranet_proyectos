import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import MenuItem from 'material-ui/MenuItem';
import {
    SelectField
} from 'redux-form-material-ui'
import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

import {connect} from "react-redux";

import BotoneriaForm from "../../../components/utilidades/forms/botoneria_form";

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);


const upper = value => value && value.toUpperCase();

class HojaTrabajoDiarioForm extends Component {
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
                    max={new Date()}
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
                    <h5 className="h5-responsive mt-2">{initialValues ? 'Editar ' : 'Crear '} Hojas de Trabajo
                        Diario</h5>
                    <div className="row">
                        {initialValues && initialValues.fecha ?
                            <div className="col-12 col-md-6">
                                <h5>Fecha: <small>{moment.tz(initialValues.fecha, "America/Bogota").format('MMMM D [de] YYYY')}</small></h5>
                            </div> :
                            <div className="col-12 col-md-6">
                                <label>Fecha</label>
                                <Field
                                    name="fecha"
                                    type="date"
                                    fullWidth={true}
                                    label="Fecha"
                                    component={this.renderDateTimePicker}
                                />
                            </div>
                        }
                        {initialValues && initialValues.colaborador ?
                            <div className="col-12">
                                <h5>Colaborador: <small>{initialValues.colaborador_nombre}</small></h5>
                            </div> :
                            <div className="col-12">
                                <Field
                                    fullWidth={true}
                                    name="colaborador"
                                    component={SelectField}
                                    hintText="Colaborador"
                                    floatingLabelText="Colaborador"
                                >
                                    {
                                        _.map(_.sortBy(colaboradores, ['nombres', 'apellidos']), (colaborador) => {
                                            return (this.renderSelectItem(colaborador))
                                        })
                                    }
                                </Field>
                            </div>
                        }
                        <BotoneriaForm
                            texto_botones='Hoja Trabajo'
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
    if (!values.fecha) {
        errors.fecha = 'Requerido';
    }

    if (!values.colaborador) {
        errors.colaborador = 'Requerido';
    }

    return errors;
};

HojaTrabajoDiarioForm = reduxForm({
    form: "hojaTrabajoDiarioForm",
    validate,
    enableReinitialize: true
})(HojaTrabajoDiarioForm);

HojaTrabajoDiarioForm = (connect(mapPropsToState, null)(HojaTrabajoDiarioForm));

export default HojaTrabajoDiarioForm;
