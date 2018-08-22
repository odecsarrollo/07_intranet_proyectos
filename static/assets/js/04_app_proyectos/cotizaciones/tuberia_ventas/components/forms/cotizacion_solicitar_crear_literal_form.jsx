import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import validate from './validate';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';

class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onDelete,
            handleSubmit,
            onSubmit,
            onCancel,
        } = this.props;
        return (
            <div className="col-12 col-md-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row card'>
                        <div className="col-12">
                            <h4>Apertura Literal</h4>
                        </div>
                        <MyTextFieldSimple
                            className="col-10"
                            nombre='Proyecto'
                            name='id_proyecto'
                            case='U'/>
                        <button
                            type='submit'
                            className='btn btn-primary mt-3'>
                            Solicitar Creación Literal
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado,
    }
}

Form = reduxForm({
    form: "cotizacionCreacionLiteralFormForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;