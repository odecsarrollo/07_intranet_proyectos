import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {
    SelectField,
    TextField
} from 'redux-form-material-ui'
import {connect} from "react-redux";

import BotoneriaForm from "../../../components/botoneria_form";


const upper = value => value && value.toUpperCase();

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
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h5 className="h5-responsive mt-2">{initialValues ? 'Cambiar ' : 'Adicionar '} Tiempo</h5>
                    <div className="row">
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

                        <div className="col-12 col-md-3">
                            <Field
                                fullWidth={true}
                                name="cantidad_minutos"
                                component={TextField}
                                hintText="Minutos"
                                autoComplete="off"
                                floatingLabelText="Minutos"
                            />
                        </div>

                        <BotoneriaForm
                            texto_botones='Tiempo'
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
    if (!values.literal) {
        errors.literal = 'Requerido';
    }
    if (!values.cantidad_minutos) {
        errors.cantidad_minutos = 'Requerido';
    } else {
        if (values.cantidad_minutos < 1) {
            errors.cantidad_minutos = 'Minutos deben de ser mayores a cero';
        }
        let re = /^-{0,1}\d+$/;
        if (!re.test(values.cantidad_minutos)) {
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
