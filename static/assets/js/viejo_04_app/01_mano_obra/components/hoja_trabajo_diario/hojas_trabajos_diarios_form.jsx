import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {MyFormTag} from '../../../components/utilidades/forms/templates';
import {
    SelectField
} from 'redux-form-material-ui'

import {connect} from "react-redux";
import {MyDateTimePickerField} from '../../../components/utilidades/forms/fields';
import {fechaFormatoUno} from '../../../components/utilidades/common';

const upper = value => value && value.toUpperCase();

class HojaTrabajoDiarioForm extends Component {
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
                nombre='Hoja Trabajo'
                onSubmit={handleSubmit(onSubmit)}
                pristine={pristine}
                submitting={submitting}
                reset={reset}
                initialValues={initialValues}
                onCancel={onCancel}
                onDelete={onDelete}
                can_delete={can_delete}
            >
                {initialValues && initialValues.fecha ?
                    <div className="col-12 col-md-6">
                        <h5>Fecha: <small>{fechaFormatoUno(initialValues.fecha)}</small></h5>
                    </div> :
                    <MyDateTimePickerField nombre='Fecha' name='fecha' className='col-md-6'/>
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
