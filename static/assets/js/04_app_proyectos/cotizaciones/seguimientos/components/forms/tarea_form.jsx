import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDateTimePickerField} from '../../../../../00_utilities/components/ui/forms/fields';
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import validate from './validate';


class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            onSubmit,
            reset,
            handleSubmit
        } = this.props;
        return (
            <form className='card' onSubmit={handleSubmit((v) => {
                onSubmit(v);
                reset();
            })}>
                <div className="row pl-3 pr-5">
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Nombre'
                        name='nombre_tarea'
                    />
                    <MyDateTimePickerField
                        className='col-12 col-md-6'
                        name='fecha_inicio_tarea'
                        nombre='Fecha'
                        max={new Date(2099, 11, 1)}
                    />
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Descripción'
                        name='observacion'
                        multiLine={true}
                        rows={2}
                    />
                    <FlatButton
                        label='Guardar'
                        primary={true}
                        type='submit'
                        disabled={submitting || pristine}
                    />
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

Form = reduxForm({
    form: "tareaForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;