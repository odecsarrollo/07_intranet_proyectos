import React, {memo, Fragment, useState} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import {useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import moment from "moment-timezone";
import PrinJs from 'print-js';
import Button from "@material-ui/core/Button";
import NuevoItemModal from './NuevoItemModal';
import PagoModal from './CobroCRUDFormPagoModal';
import Literales from './CobroCRUDFormLiterales';
import * as actions from '../../../../../01_actions/01_index';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fechaFormatoUno, numeroFormato} from "../../../../../00_utilities/common";

const style = {
    tabla: {
        fontSize: '0.7rem',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            td_icono: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
                minWidth: '120px'
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
        }
    }
};

let Form = memo(props => {
    const [show_adicionar_item, setAdicionarItem] = useState(false);
    const [show_cobrada_modal, setCobradaModal] = useState(false);
    const [show_mas_opciones, setMostrarMasOpciones] = useState(false);
    const [show_relacionar_literal, setMostrarRelacionar] = useState(false);
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
    const dispatch = useDispatch();
    const imprimirCobro = () => {
        const imprimir_liquidacion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        dispatch(actions.printCobroProformaAnticipo(initialValues.id, {callback: imprimir_liquidacion}));
    };

    const adicionarItem = (item) => {
        const {cantidad, valor_unitario, descripcion, referencia} = item;
        dispatch(actions.addItemProformaAnticipo(initialValues.id, cantidad, descripcion, valor_unitario, referencia, {callback: () => setAdicionarItem(false)}));
    };

    const eliminarItem = (item_id) => {
        dispatch(actions.eliminarItemProformaAnticipo(initialValues.id, item_id, {callback: () => setAdicionarItem(false)}));
    };

    const enviarPorEmail = () => {
        const mensaje_exitoso = () => dispatch(actions.notificarAction('Se ha enviado correctamente', {'title': 'Envío de proforma'}));
        dispatch(actions.enviarProformaAnticipo(initialValues.id, {callback: mensaje_exitoso}));
    };

    const editar = () => dispatch(actions.cambiarEstadoProformaAnticipo(initialValues.id, 'EDICION'));

    const recibida = () => dispatch(actions.cambiarEstadoProformaAnticipo(initialValues.id, 'RECIBIDA'));

    const cobrada = (fecha_cobro) => dispatch(actions.cambiarEstadoProformaAnticipo(initialValues.id, 'CERRADA', fecha_cobro));

    const anulada = () => dispatch(actions.cambiarEstadoProformaAnticipo(initialValues.id, 'ANULADA'));


    const editable = initialValues ? initialValues.editable : true;
    const esta_cerrada = initialValues ? initialValues.estado === 'CERRADA' : false;
    const fue_recibida = initialValues ? initialValues.estado === 'RECIBIDA' : false;
    const puede_enviar = !submitting && pristine && initialValues && initialValues.items.length > 0 && (initialValues.email_destinatario_dos || initialValues.email_destinatario);
    return (
        <MyFormTagModal
            fullScreen={true}
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => onSubmit(
                {...v, fecha: moment(v.fecha).format('YYYY-MM-DD')},
                null,
                null,
                false
            ))
            }
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >

            {
                show_cobrada_modal &&
                <PagoModal
                    onCobrada={cobrada}
                    is_open={show_cobrada_modal}
                    onCerrar={() => setCobradaModal(false)}
                    fecha_minima={initialValues.fecha}
                />
            }
            <MyCombobox
                className="col-12 col-md-6 col-lg-4"
                data={[
                    {id: 'COP', nombre: 'COP'},
                    {id: 'USD', nombre: 'USD'},
                    {id: 'EUR', nombre: 'EUR'},
                ]}
                filter='contains'
                placeholder='Tipo Divisa'
                valueField='id'
                textField='nombre'
                name='divisa'
                readOnly={!editable}
            />
            <MyCombobox
                className="col-12 col-md-6 col-lg-4"
                data={[
                    {id: 'PROFORMA', nombre: 'Proforma'},
                    {id: 'CUENTA_COBRO', nombre: 'Cuenta Cobro'},
                ]}
                filter='contains'
                placeholder='Tipo Documento'
                valueField='id'
                textField='nombre'
                name='tipo_documento'
                readOnly={!editable}
            />
            <MyDateTimePickerField
                className='col-12 col-md-6 col-lg-4'
                name='fecha'
                nombre='Fecha'
                dropUp={false}
                readOnly={!editable}
            />
            <MyTextFieldSimple
                className="col-12 col-md-6 col-lg-4 pr-4"
                nombre='Nombre Cliente'
                name='nombre_cliente'
                disabled={!editable}
            />
            <MyTextFieldSimple
                className="col-12 col-md-6 col-lg-3 pr-3"
                nombre='Nit'
                name='nit'
                disabled={!editable}
            />
            <MyTextFieldSimple
                className="col-12 col-md-6 col-lg-2 pr-3"
                nombre='Nro. Orden Compra'
                name='nro_orden_compra'
                disabled={!editable}
            />
            {
                initialValues &&
                !esta_cerrada &&
                initialValues.id &&
                <MyDateTimePickerField
                    max={new Date(2099, 11, 31)}
                    name='fecha_seguimiento'
                    nombre='Verificar el...'
                    className="col-12 col-md-6 col-lg-2 col-md-3"
                />
            }
            <div className='col-12'>
                <div className="row">
                    <MyTextFieldSimple
                        multiline
                        rows={4}
                        className="col-12 col-md-5 pr-3"
                        nombre='Cliente'
                        name='informacion_cliente'
                        disabled={!editable}
                        case='U'/>
                    <MyTextFieldSimple
                        multiline
                        rows={4}
                        className="col-12 col-md-4 pr-3"
                        nombre='Locatario'
                        name='informacion_locatario'
                        disabled={!editable}
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pr-3"
                        nombre='Condición Pago'
                        name='condicion_pago'
                        multiline={true}
                        rows={4}
                        disabled={!editable}
                    />
                </div>
            </div>
            {
                show_adicionar_item &&
                <div className='col-12'>
                    <NuevoItemModal
                        adicionarItem={adicionarItem}
                        eliminarItem={eliminarItem}
                        is_open={show_adicionar_item}
                        onCancel={() => setAdicionarItem(false)}
                    />
                </div>
            }
            <div className="col-12">
                <div className="row">
                    {
                        initialValues &&
                        initialValues.id &&
                        <div className="col-12">Items:
                            {
                                editable &&
                                <FontAwesomeIcon
                                    className='puntero'
                                    icon={'plus-circle'}
                                    onClick={() => setAdicionarItem(!show_adicionar_item)}
                                />
                            }
                        </div>
                    }
                    <div className="col-12">
                        {
                            initialValues &&
                            initialValues.items.length > 0 &&
                            <table className='table table-responsive table-striped' style={style.tabla}>
                                <thead>
                                <tr style={style.tabla.tr}>
                                    <th style={style.tabla.tr.th}>Referencia</th>
                                    <th style={style.tabla.tr.th}>Descripción</th>
                                    <th style={style.tabla.tr.th_numero}>Cantidad</th>
                                    <th style={style.tabla.tr.th_numero}>Valor Unitario</th>
                                    <th style={style.tabla.tr.th_numero}>Valor Total</th>
                                    {editable && <th></th>}
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    initialValues.items.map(
                                        e => <tr key={e.id} style={style.tabla.tr}>
                                            <td style={style.tabla.tr.td}>{e.referencia}</td>
                                            <td style={style.tabla.tr.td}>{e.descripcion}</td>
                                            <td style={style.tabla.tr.td_numero}>{e.cantidad}</td>
                                            <td style={style.tabla.tr.td_numero}>{numeroFormato(e.valor_unitario, 2)} {initialValues.divisa}</td>
                                            <td style={style.tabla.tr.td_numero}>{numeroFormato(e.valor_unitario * e.cantidad, 2)} {initialValues.divisa}</td>
                                            {
                                                editable &&
                                                <td style={style.tabla.tr.td_icono}>
                                                    <FontAwesomeIcon
                                                        className='puntero'
                                                        icon={'trash'}
                                                        onClick={() => eliminarItem(e.id)}
                                                    />
                                                </td>
                                            }
                                        </tr>
                                    )
                                }
                                </tbody>
                                <tfoot>
                                <tr style={style.tabla.tr}>
                                    <td style={style.tabla.tr.td}>Valor Ant. Impuestos</td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td_numero}>{numeroFormato(initialValues.valor_total_sin_impuesto, 2)} {initialValues.divisa}</td>
                                    <td style={style.tabla.tr.td_icono}></td>
                                </tr>
                                <tr style={style.tabla.tr}>
                                    <td style={style.tabla.tr.td}>Impuesto</td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td_numero}>{numeroFormato(initialValues.impuesto, 2)} {initialValues.divisa}</td>
                                    <td style={style.tabla.tr.td_icono}></td>
                                </tr>
                                <tr style={style.tabla.tr}>
                                    <td style={style.tabla.tr.td}>Valor Total</td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td}></td>
                                    <td style={style.tabla.tr.td_numero}>{numeroFormato(parseFloat(initialValues.valor_total_sin_impuesto) + parseFloat(initialValues.impuesto), 2)} {initialValues.divisa}</td>
                                    <td style={style.tabla.tr.td_icono}></td>
                                </tr>
                                </tfoot>
                            </table>
                        }
                    </div>
                    {
                        initialValues &&
                        initialValues.items.length > 0 &&
                        <MyTextFieldSimple
                            className="col-12 col-md-6 pr-3"
                            nombre='Impuesto'
                            name='impuesto'
                            case='U'
                            type='number'
                            disabled={!editable}
                        />
                    }
                </div>
            </div>
            {
                initialValues &&
                initialValues.id &&
                <Fragment>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">Destinatario Correo:</div>
                            <MyTextFieldSimple
                                className="col-12 col-md-6 pr-3"
                                nombre='Email Destino'
                                name='email_destinatario'
                                case='U'
                                type='email'
                                disabled={!editable}
                            />
                            <MyTextFieldSimple
                                className="col-12 col-md-6 pr-3"
                                nombre='Email Destino Dos'
                                name='email_destinatario_dos'
                                case='U'
                                type='email'
                                disabled={!editable}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <Button
                            color="primary"
                            onClick={() => imprimirCobro()}
                            disabled={!(submitting || pristine)}
                        >
                            Imprimir Comprobante
                        </Button>
                        <FontAwesomeIcon
                            className='puntero'
                            icon={`${show_mas_opciones ? 'minus' : 'plus'}-circle`}
                            onClick={() => setMostrarMasOpciones(!show_mas_opciones)}
                        />
                        {show_mas_opciones &&
                        <Fragment>
                            {
                                !esta_cerrada &&
                                <Button
                                    color="primary"
                                    onClick={() => enviarPorEmail()}
                                    disabled={!puede_enviar}
                                >
                                    Enviar
                                </Button>
                            }
                            {
                                !editable &&
                                !esta_cerrada &&
                                <Button
                                    color="primary"
                                    onClick={() => editar()}
                                    disabled={!(submitting || pristine)}
                                >
                                    Editar
                                </Button>
                            }
                            {
                                !editable &&
                                !esta_cerrada &&
                                initialValues.estado !== 'RECIBIDA' &&
                                <Button
                                    color="primary"
                                    onClick={() => recibida()}
                                    disabled={!(submitting || pristine)}
                                >
                                    Recibida
                                </Button>
                            }
                            {
                                !editable &&
                                fue_recibida &&
                                !esta_cerrada &&
                                <Button
                                    style={{marginLeft: '90px'}}
                                    color="secondary"
                                    onClick={() => setCobradaModal(true)}
                                    disabled={!(submitting || pristine)}
                                >
                                    Cobrada
                                </Button>
                            }
                        </Fragment>
                        }
                    </div>
                    {
                        initialValues.fecha_cobro &&
                        <div>
                            Pagada en {fechaFormatoUno(initialValues.fecha_cobro)}
                        </div>
                    }
                </Fragment>
            }
            <Literales cobro={initialValues}/>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "proformaAnticipoForm",
    enableReinitialize: true
})(Form);

export default Form;