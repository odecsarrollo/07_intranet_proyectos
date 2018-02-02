import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {
    TextField,
    Checkbox
} from 'redux-form-material-ui'
import {connect} from "react-redux";

import BotoneriaForm from "../../../../components/botoneria_form";

const upper = value => value && value.toUpperCase();

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
            can_delete,
            cantidad_literales
        } = this.props;
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h5 className="h5-responsive mt-2">{initialValues ? 'Editar ' : 'Crear '} Proyecto</h5>
                    <div className="row">
                        <div className="col-12">
                            {cantidad_literales === 0 || !initialValues ?
                                <Field
                                    fullWidth={true}
                                    name="id_proyecto"
                                    component={TextField}
                                    hintText="OP Proyecto"
                                    autoComplete="off"
                                    floatingLabelText="OP Proyecto"
                                    normalize={upper}
                                /> :
                                <span>{initialValues.id_proyecto}</span>
                            }
                        </div>
                        <div className="col-12">
                            <Field
                                name="abierto"
                                component={Checkbox}
                                label="Proyecto Abierto"
                                normalize={v => !!v}
                            />
                        </div>
                        <BotoneriaForm
                            pristine={pristine}
                            submitting={submitting}
                            reset={reset}
                            initialValues={initialValues}
                            onCancel={onCancel}
                            onDelete={onDelete}
                            can_delete={can_delete && cantidad_literales === 0}
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
    if (!values.id_proyecto) {
        errors.id_proyecto = 'Requerido';
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
