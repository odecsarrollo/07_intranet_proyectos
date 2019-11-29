import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import FormBaseCotizacion from '../../cotizaciones/forms/CotizacionFormBase';
import {formValueSelector} from 'redux-form';

const selector = formValueSelector('cotizacionForm');

let Form = memo(props => {
    const {
        initialValues,
        pristine,
        submitting,
        reset,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
        change
    } = props;
    const myValues = useSelector(state => selector(state, 'estado', 'valor_ofertado', 'cliente', 'unidad_negocio', 'subir_anterior', 'cotizacion_inicial'));

    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <FormBaseCotizacion
                change={change}
                myValues={myValues}
            />
            <div style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "cotizacionForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;