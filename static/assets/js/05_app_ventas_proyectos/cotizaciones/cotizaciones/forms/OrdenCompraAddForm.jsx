import moment from "moment-timezone";
import React, {Fragment, memo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import {formValueSelector, reduxForm} from 'redux-form';
import {fechaToYMD, formatoMoneda} from "../../../../00_utilities/common";
import {
    MyDateTimePickerField,
    MyFieldFileInput,
    MyTextFieldSimple
} from '../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import * as actions from '../../../../01_actions/01_index';
import validate from './orden_compra_add_validate_form';

const selector = formValueSelector('ordenCompraAddForm');

const OrdenCompraTableItem = (props) => {
    const {
        fila,
        addFormaPagoPorcentaje,
        addFormaPagoFecha,
        form_values
    } = props;
    return (<tr>
            <td>{fila.motivo}</td>
            <td>
                <input
                    type='number'
                    value={fila.porcentaje}
                    onChange={(event) => addFormaPagoPorcentaje(fila.id, parseFloat(event.target.value))}
                />
            </td>
            <td>
                <DateTimePicker
                    onChange={value => addFormaPagoFecha(fila.id, value)}
                    format={'YYYY-MM-DD'}
                    time={false}
                    min={form_values.orden_compra_fecha}
                    value={fila.fecha ? new Date(fila.fecha) : new Date()}
                />
            </td>
            <td className='text-right'>
                {formatoMoneda(form_values.valor_orden_compra * (fila.porcentaje / 100), '$', 2)}
            </td>
        </tr>
    )
}

let OrdenCompraAddForm = memo(props => {
    const dispatch = useDispatch();
    const [forma_pago, setFormaPago] = useState({
        [1]: {id: 1, motivo: 'Orden de Compra', valor: 0, porcentaje: 0, fecha: null},
        [2]: {id: 2, motivo: 'Anticipo', valor: 0, porcentaje: 0, fecha: null},
        [3]: {id: 3, motivo: 'Aprobación de Planos', valor: 0, porcentaje: 0, fecha: null},
        [4]: {id: 4, motivo: 'Avance de Obra', valor: 0, porcentaje: 0, fecha: null},
        [5]: {id: 5, motivo: 'Pruebas Fat', valor: 0, porcentaje: 0, fecha: null},
        [6]: {id: 6, motivo: 'Instalación', valor: 0, porcentaje: 0, fecha: null},
        [7]: {id: 7, motivo: 'Aceptación de Proyecto', valor: 0, porcentaje: 0, fecha: null},
    });

    const form_values = useSelector(state => selector(state, 'valor_orden_compra', 'orden_compra_fecha'));
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
        permisos_object,
        cotizacion
    } = props;
    const porcentaje_total = _.map(forma_pago).reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento['porcentaje']), 0);
    const forma_pago_total = _.map(forma_pago).reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento['valor']), 0);

    const submitObject = (item) => {
        let datos_a_subir = new FormData();
        let datos_formulario = _.omit(item, 'orden_compra_archivo');
        let {orden_compra_fecha} = datos_formulario;
        if (orden_compra_fecha) {
            if ((typeof orden_compra_fecha) === 'string') {
                orden_compra_fecha = new Date(orden_compra_fecha)
            }
            orden_compra_fecha = moment(orden_compra_fecha).tz('America/Bogota').format('YYYY-MM-DD');
            datos_formulario = {...datos_formulario, orden_compra_fecha};
        }
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.orden_compra_archivo) {
            if (typeof item.documento !== 'string') {
                datos_a_subir.append('orden_compra_archivo', item.orden_compra_archivo[0]);
            }
        }
        datos_a_subir.append('plan_pago', JSON.stringify(forma_pago));
        return datos_a_subir;
    };

    const addFormaPagoPorcentaje = (id, valor) => {
        setFormaPago({
            ...forma_pago,
            [id]: {
                ...forma_pago[id],
                porcentaje: isNaN(valor) ? 0 : valor,
                valor: form_values.valor_orden_compra * (isNaN(valor) ? 0 : valor / 100)
            }
        })
    }

    const addFormaPagoFecha = (id, valor) => {
        setFormaPago({
            ...forma_pago,
            [id]: {
                ...forma_pago[id],
                fecha: fechaToYMD(valor)
            }
        })
    }

    const addOrdenCompra = (value) => {
        dispatch(actions.adicionarOrdenCompraCotizacion(cotizacion.id, value))
    }

    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => addOrdenCompra(submitObject(v)))}
            reset={reset}
            fullScreen={true}
            initialValues={initialValues}
            submitting={submitting || porcentaje_total !== 100}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyDateTimePickerField
                label='Fecha Entregada'
                label_space_xs={4}
                name='orden_compra_fecha'
                nombre='Fecha Orden de Compra'
                className='col-12 col-md-4'
                max={new Date()}
            />
            <MyTextFieldSimple
                nombre='Valor OC'
                name='valor_orden_compra'
                className="col-12 col-md-4"
                type='number'
            />
            <MyTextFieldSimple
                nombre='Nro. Orden Compra'
                name='orden_compra_nro'
                className="col-12 col-md-4"
                case='U'/>
            <MyFieldFileInput className='col-12 p-2' name="orden_compra_archivo"/>
            {form_values.valor_orden_compra && form_values.valor_orden_compra > 0 && <Fragment>
                <table className='table' style={{minHeight: '400px'}}>
                    <thead>
                    <tr>
                        <th>Motivo</th>
                        <th>Porcentaje</th>
                        <th>Fecha</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>


                    {_.map(forma_pago, f => <OrdenCompraTableItem
                        key={f.id}
                        fila={f}
                        addFormaPagoPorcentaje={addFormaPagoPorcentaje}
                        addFormaPagoFecha={addFormaPagoFecha}
                        form_values={form_values}
                    />)}


                    </tbody>
                    <tfoot>
                    <tr>
                        <td>{porcentaje_total}%</td>
                        <td></td>
                        <td className='text-right'>{formatoMoneda(forma_pago_total, '$', 0)}</td>
                    </tr>
                    </tfoot>
                </table>
            </Fragment>}
        </MyFormTagModal>
    )

});

OrdenCompraAddForm = reduxForm({
    form: "ordenCompraAddForm",
    validate,
    enableReinitialize: true
})(OrdenCompraAddForm);

export default OrdenCompraAddForm;