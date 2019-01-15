import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import validate from './validate';
import {formValueSelector} from 'redux-form'
import {connect} from "react-redux";
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
} from '../../../../00_utilities/components/ui/forms/fields';
import moment from "moment-timezone";

const selector = formValueSelector('proyectoReporteCostosForm');

class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            handleSubmit,
            onSubmit,
            valores
        } = this.props;
        return (
            <form className='p-4' onSubmit={handleSubmit(v => onSubmit(v))}>
                <div className="row">
                    <MyTextFieldSimple
                        className="col-3"
                        nombre='Año'
                        name='ano'
                    />
                    <MyTextFieldSimple
                        className="col-3 ml-2"
                        nombre='Trimestre'
                        name='trimestre'
                    />
                    <div className="cal-6">
                        <button className='btn btn-primary' type="submit" disabled={pristine || submitting}>
                            Generar
                        </button>
                        <button type="button" disabled={pristine || submitting} onClick={reset}>
                            Limpiar
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        valores: selector(state, 'trimestre', 'ano'),
    }
}

Form = reduxForm({
    form: "tuberiaVentasForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;