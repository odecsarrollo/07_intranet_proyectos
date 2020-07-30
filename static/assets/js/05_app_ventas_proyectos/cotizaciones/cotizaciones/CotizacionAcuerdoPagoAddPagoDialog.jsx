import moment from "moment-timezone";
import React, {memo} from 'react';
import {useSelector} from "react-redux";
import {formValueSelector, reduxForm} from 'redux-form';
import {formatoDinero} from "../../../00_utilities/common";
import {
    MyDateTimePickerField,
    MyFieldFileInput,
    MyTextFieldSimple
} from '../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../00_utilities/components/ui/forms/MyFormTagModal';

const selector = formValueSelector('cotizacionAcuerdoPagoAddPagoDialog');

let CotizacionAcuerdoPagoAddPagoDialog = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
    } = props;
    const values = useSelector(state => selector(state, 'valor', ''));
    const submitObject = (values) => {
        console.log(values, 'los values')
        let datos_a_subir = new FormData();
        let datos_formulario = _.omit(values, 'comprobante_pago');
        let {fecha} = datos_formulario;
        let {comprobante_pago} = values;
        if (fecha) {
            fecha = typeof fecha === 'string' ? new Date(fecha) : moment(fecha).tz('America/Bogota').format('YYYY-MM-DD');
            datos_formulario = {...datos_formulario, fecha};
        }
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (comprobante_pago) {
            if (typeof comprobante_pago !== 'string') {
                datos_a_subir.append('comprobante_pago', comprobante_pago[0]);
            }
        }
        return datos_a_subir;
    };
    return (
        <MyFormTagModal
            submit_text_boton='Adicionar'
            onCancel={onCancel}
            onSubmit={handleSubmit(v => onSubmit(submitObject(v)))}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type='Pago'
        >
            <MyDateTimePickerField
                name='fecha'
                label='Fecha Pago'
                className='col-12'
                label_space_xs={4}
                min={new Date()}
                max={new Date(3000, 1, 1)}
            />
            <MyTextFieldSimple
                className='col-12'
                name='valor'
                nombre='Valor'
                type='number'
            />
            <span>Comprobande de Pago</span>
            <MyFieldFileInput className='col-12 p-2' name="comprobante_pago"/>
            <div><span>{formatoDinero(values.valor, '$', 0)}</span></div>
            <div style={{height: '300px'}}/>
        </MyFormTagModal>
    )
});

CotizacionAcuerdoPagoAddPagoDialog = reduxForm({
    form: "cotizacionAcuerdoPagoAddPagoDialog",
    enableReinitialize: true
})(CotizacionAcuerdoPagoAddPagoDialog);

export default CotizacionAcuerdoPagoAddPagoDialog;