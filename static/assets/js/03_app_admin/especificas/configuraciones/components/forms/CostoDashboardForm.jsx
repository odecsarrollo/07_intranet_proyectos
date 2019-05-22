import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyDateTimePickerField} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import validate from './validate';
import Button from '@material-ui/core/Button';


class ConfiguracionCostosForm extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h4>Configuración Costos</h4>
                <div className="row">
                    <MyDateTimePickerField
                        className='col-12 mb-5'
                        name='fecha_cierre'
                        nombre='Fecha Cierre Costos MO'
                        dropUp={false}
                    />

                    <div className='col-12'>
                        <Button
                            color="primary"
                            variant="contained"
                            type='submit'
                            className='ml-3'
                            disabled={submitting || pristine}
                        >
                            {initialValues ? 'Guardar ' : 'Crear '}
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            className='ml-3'
                            onClick={reset}
                            disabled={submitting || pristine}
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {configuracion} = ownProps;
    return {
        initialValues: configuracion
    }
}

ConfiguracionCostosForm = reduxForm({
    form: "configuracionCostosForm",
    validate: validate,
    enableReinitialize: true
})(ConfiguracionCostosForm);

ConfiguracionCostosForm = (connect(mapPropsToState, null)(ConfiguracionCostosForm));

export default ConfiguracionCostosForm;