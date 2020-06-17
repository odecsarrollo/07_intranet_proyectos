import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import React, {useState, memo, Fragment} from 'react';
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import {reduxForm, formValueSelector} from 'redux-form';
import {fechaToYMD, formatoMoneda} from "../../../../00_utilities/common";
import validate from './orden_compra_add_validate_form';
import * as actions from '../../../../01_actions/01_index';
import {
    MyDateTimePickerField,
    MyFieldFileInput,
    MyTextFieldSimple
} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

const selector = formValueSelector('ordenCompraAddForm');

let OrdenCompraAddForm = memo(props => {
    const dispatch = useDispatch();
    const [forma_pago, setFormaPago] = useState({['n']: {id: 'n', valor: 0, porcentaje: 0, fecha: null}});
    const form_values = useSelector(state => selector(state, 'valor_orden_compra', ''));
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
                className='col-12'
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
                <table className='table table-responsive' style={{minHeight: '400px'}}>
                    <thead>
                    <tr>
                        <th>Porcentaje</th>
                        <th>Fecha</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(forma_pago, f => <tr key={f.id}>{
                        <Fragment>
                            <td>
                                <input
                                    type='number'
                                    value={f.porcentaje}
                                    onChange={(event) => addFormaPagoPorcentaje(f.id, parseFloat(event.target.value))}
                                />
                            </td>
                            <td>
                                <DateTimePicker
                                    onChange={value => addFormaPagoFecha(f.id, value)}
                                    format={'YYYY-MM-DD'}
                                    time={false}
                                    min={new Date()}
                                    value={f.fecha ? new Date(f.fecha) : new Date()}
                                />
                            </td>
                            <td className='text-right'>
                                {formatoMoneda(form_values.valor_orden_compra * (f.porcentaje / 100), '$', 2)}
                            </td>
                        </Fragment>
                    }</tr>)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>{porcentaje_total}%</td>
                        <td></td>
                        <td className='text-right'>{formatoMoneda(forma_pago_total, '$', 0)}</td>
                    </tr>
                    </tfoot>
                </table>
                {porcentaje_total !== 100 && <FontAwesomeIcon onClick={() => setFormaPago({
                    ...forma_pago,
                    [`n-${_.size(forma_pago) + 1}`]: {id: `n-${_.size(forma_pago) + 1}`, porcentaje: 0, valor: 0}
                })} icon={'info-circle'} size='1x'/>
                }
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