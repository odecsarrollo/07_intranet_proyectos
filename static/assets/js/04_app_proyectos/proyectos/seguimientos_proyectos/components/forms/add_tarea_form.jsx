import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {
    MyTextFieldSimple,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";

class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit
        } = this.props;
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h4>{initialValues ? 'Editar Tarea' : 'Nueva Tarea'}</h4>
                    <div className="row">
                        <MyTextFieldSimple
                            className='col-11'
                            nombre='Descripción'
                            name='descripcion'
                        />
                        <MyDateTimePickerField
                            className='col-12'
                            nombre='Fecha Límite'
                            name='fecha_limite'
                            max={new Date(2999, 12, 31)}
                        />
                    </div>
                </div>
                <BotoneriaModalForm
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
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

Form = reduxForm({
    form: "addTareaSeguimientoForm",
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;