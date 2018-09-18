import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {
    MyTextFieldSimple,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';

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
                    <h4>Nueva Tarea</h4>
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
                        />
                    </div>
                </div>
                <BotoneriaModalForm
                    conCerrar={false}
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

Form = reduxForm({
    form: "addTareaSeguimientoForm",
})(Form);

export default Form;