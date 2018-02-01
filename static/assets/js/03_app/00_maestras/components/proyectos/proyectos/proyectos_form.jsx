import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {
    TextField,
    Checkbox
} from 'redux-form-material-ui'
import {connect} from "react-redux";

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
            initialValues
        } = this.props;
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h5 className="h5-responsive mt-2">{initialValues ? 'Editar ' : 'Crear '} Proyecto</h5>
                    <div className="row">
                        <div className="col-12">
                            <Field
                                fullWidth={true}
                                name="id_proyecto"
                                component={TextField}
                                hintText="OP Proyecto"
                                autoComplete="off"
                                floatingLabelText="OP Proyecto"
                                normalize={upper}
                            />
                        </div>
                        <div className="col-12">
                            <Field
                                name="cerrado"
                                component={Checkbox}
                                label="Esta Cerrado"
                                normalize={v => !!v}
                            />
                        </div>

                        <div className="col-12">
                            <button type="button" className="btn btn-secondary" onClick={reset}
                                    disabled={pristine || submitting}>
                                Limpiar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>
                                {initialValues ? 'Editar ' : 'Crear '} Proyecto
                            </button>
                            {initialValues &&
                            <button type="button" className="btn btn-deep-orange" onClick={() => {
                                onDelete(initialValues.id)
                            }}>
                                Eliminar
                            </button>
                            }
                            <button type="button" className="btn btn-deep-orange" onClick={() => {
                                onCancel()
                            }}>
                                Cancelar
                            </button>
                        </div>
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
    if (!values.nombre) {
        errors.nombre = 'Requerido';
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
