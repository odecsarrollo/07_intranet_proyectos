import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import React, {Fragment, memo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import {formValueSelector, reduxForm} from 'redux-form';
import {fechaToYMD, formatoMoneda, pesosColombianos} from "../../../../00_utilities/common";
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
        addRequisitos,
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
                {fila.porcentaje > 0 &&
                <textarea
                    placeholder={`Indique aqui las condiciones requeridas para la aprobación de ${fila.motivo}`}
                    value={fila.requisitos}
                    onChange={(event) => addRequisitos(fila.id, event.target.value)}
                    rows={4}
                    cols={40}
                />}
            </td>

            <td>
                {fila.porcentaje > 0 && <DateTimePicker
                    onChange={value => addFormaPagoFecha(fila.id, value)}
                    format={'YYYY-MM-DD'}
                    time={false}
                    min={form_values.orden_compra_fecha}
                    value={fila.fecha_proyectada ? new Date(fila.fecha_proyectada) : new Date()}
                />}
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
        [2]: {id: 2, motivo: 'Anticipo', valor_proyectado: 0, porcentaje: 0, fecha_proyectada: null, requisitos: ''},
        [3]: {
            id: 3,
            motivo: 'Aprobación de Planos',
            valor_proyectado: 0,
            porcentaje: 0,
            fecha_proyectada: null,
            requisitos: ''
        },
        [4]: {
            id: 4,
            motivo: 'Avance de Obra',
            valor_proyectado: 0,
            porcentaje: 0,
            fecha_proyectada: null,
            requisitos: ''
        },
        [5]: {id: 5, motivo: 'Pruebas Fat', valor_proyectado: 0, porcentaje: 0, fecha_proyectada: null, requisitos: ''},
        [6]: {
            id: 6,
            motivo: 'Contra Entrega',
            valor_proyectado: 0,
            porcentaje: 0,
            fecha_proyectada: null,
            requisitos: ''
        },
        [7]: {id: 7, motivo: 'Instalación', valor_proyectado: 0, porcentaje: 0, fecha_proyectada: null, requisitos: ''},
        [8]: {
            id: 8,
            motivo: 'Aceptación de Proyecto',
            valor_proyectado: 0,
            porcentaje: 0,
            fecha_proyectada: null,
            requisitos: ''
        },
    });

    const form_values = useSelector(state => selector(state, 'valor_orden_compra', 'orden_compra_fecha'));
    const {
        pristine,
        submitting,
        reset,
        initialValues,//LOS INITIAL VALUES SON SÓLO PARA DUPLICAR LAS OC VIEJAS, LUEGO SE PODRÁ QUITAR
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
        cotizacion,
        change
    } = props;
    const porcentaje_total = _.map(forma_pago).reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento['porcentaje']), 0);
    const forma_pago_total = _.map(forma_pago).reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento['valor_proyectado']), 0);

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
            if (typeof item.orden_compra_archivo !== 'string') {
                datos_a_subir.append('orden_compra_archivo', item.orden_compra_archivo[0]);
            }
        }
        datos_a_subir.append('plan_pago', JSON.stringify(forma_pago));
        return datos_a_subir;
    };

    const addFormaPagoPorcentaje = (id, valor) => {
        const porcentaje = isNaN(valor) ? 0 : valor;
        const fecha_proyectada = porcentaje <= 0 ? null : (form_values.fecha_proyectada ? form_values.fecha_proyectada : fechaToYMD(new Date()));
        const valor_proyectado = form_values.valor_orden_compra * (porcentaje / 100);
        setFormaPago({
            ...forma_pago,
            [id]: {...forma_pago[id], porcentaje, valor_proyectado, fecha_proyectada}
        })
    }

    const addRequisitos = (id, valor) => {
        setFormaPago({
            ...forma_pago,
            [id]: {
                ...forma_pago[id],
                requisitos: valor
            }
        })
    }

    const addFormaPagoFecha = (id, valor) => {
        setFormaPago({
            ...forma_pago,
            [id]: {
                ...forma_pago[id],
                fecha_proyectada: fechaToYMD(valor)
            }
        })
    }

    const addOrdenCompra = (value) => dispatch(actions.adicionarOrdenCompraCotizacion(cotizacion.id, value, {callback: onCancel}));
    const valor_ofertado_restante = cotizacion.valor_ofertado - (cotizacion.valores_oc === undefined ? 0 : cotizacion.valores_oc)
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
            <div className="col-12">
                Valor
                Ofertado: {pesosColombianos(valor_ofertado_restante)}
                <FontAwesomeIcon
                    className='puntero'
                    icon='paste'
                    onClick={() => change('valor_orden_compra', valor_ofertado_restante)}/>
            </div>
            <MyDateTimePickerField
                label='Fecha en la OC'
                label_space_xs={4}
                name='orden_compra_fecha'
                nombre='Fecha Orden de Compra'
                readOnly={initialValues && !!initialValues.orden_compra_fecha}
                className='col-12 col-md-4'
                max={new Date()}
            />
            <MyTextFieldSimple
                nombre='Valor OC'
                disabled={initialValues && !!initialValues.valor_orden_compra}
                name='valor_orden_compra'
                className="col-12 col-md-4"
                type='number'
            />
            <MyTextFieldSimple
                nombre='Nro. Orden Compra'
                name='orden_compra_nro'
                className="col-12 col-md-4"
                case='U'/>
            <div>
                {((initialValues && !initialValues.orden_compra_archivo_url) || !initialValues) &&
                <MyFieldFileInput className='col-12 p-2' name="orden_compra_archivo"/>}
            </div>
            {form_values.valor_orden_compra && form_values.valor_orden_compra > 0 && <Fragment>
                <table className='table' style={{minHeight: '400px'}}>
                    <thead>
                    <tr>
                        <th>Motivo</th>
                        <th>Porcentaje</th>
                        <th>Requisitos</th>
                        <th>Fecha Proyectada</th>
                        <th>Valor Proyectado</th>
                    </tr>
                    </thead>
                    <tbody>


                    {_.map(forma_pago, f => <OrdenCompraTableItem
                        key={f.id}
                        fila={f}
                        addFormaPagoPorcentaje={addFormaPagoPorcentaje}
                        addFormaPagoFecha={addFormaPagoFecha}
                        addRequisitos={addRequisitos}
                        form_values={form_values}
                    />)}


                    </tbody>
                    <tfoot>
                    <tr>
                        <td>{porcentaje_total}%</td>
                        <td></td>
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