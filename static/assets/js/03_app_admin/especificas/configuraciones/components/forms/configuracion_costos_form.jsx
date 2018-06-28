import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyDateTimePickerField} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import configuracion_costos_validate from './configuracion_costos_validate';
import {FlatIconModal} from '../../../../../00_utilities/components/ui/icon/iconos_base';


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
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <h4>Configuración Costos</h4>
                <div className="row">
                    <MyDateTimePickerField
                        className='col-12 mb-5'
                        name='fecha_cierre'
                        nombre='Fecha Cierre Costos MO'
                        dropUp={false}
                    />

                    <div className='col-12'>
                        <FlatIconModal
                            text={initialValues ? 'Guardar ' : 'Crear '}
                            primary={true}
                            disabled={submitting || pristine}
                            type='submit'
                        />
                        <FlatIconModal
                            text="Limpiar"
                            primary={false}
                            disabled={submitting || pristine}
                            onClick={reset}
                        />
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
    validate: configuracion_costos_validate,
    enableReinitialize: true
})(ConfiguracionCostosForm);

ConfiguracionCostosForm = (connect(mapPropsToState, null)(ConfiguracionCostosForm));

export default ConfiguracionCostosForm;