import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import moment from "moment-timezone";
import PrinJs from 'print-js';
import Button from "@material-ui/core/Button";
import NuevoItemModal from './NuevoItemModal';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {numeroFormato} from "../../../../../00_utilities/common";

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

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_adicionar_item: false
        };
        this.adicionarItem = this.adicionarItem.bind(this);
        this.eliminarItem = this.eliminarItem.bind(this);
        this.editar = this.editar.bind(this);
        this.recibida = this.recibida.bind(this);
        this.cobrada = this.cobrada.bind(this);
        this.anulada = this.anulada.bind(this);
        this.enviarPorEmail = this.enviarPorEmail.bind(this);
    }


    imprimirCobro() {
        const {initialValues} = this.props;
        const imprimir_liquidacion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        this.props.printCobroProformaAnticipo(initialValues.id, {callback: imprimir_liquidacion});
    }

    adicionarItem(item) {
        const {cantidad, valor_unitario, descripcion} = item;
        const {initialValues} = this.props;
        this.props.addItemProformaAnticipo(initialValues.id, cantidad, descripcion, valor_unitario, {callback: () => this.setState({show_adicionar_item: false})});
    }

    eliminarItem(item_id) {
        const {initialValues} = this.props;
        this.props.eliminarItemProformaAnticipo(initialValues.id, item_id, {callback: () => this.setState({show_adicionar_item: false})});
    }

    enviarPorEmail() {
        const {initialValues, notificarAction} = this.props;
        const mensaje_exitoso = () => notificarAction('Se ha enviado correctamente', {'title': 'Envío de proforma'})
        this.props.enviarProformaAnticipo(initialValues.id, {callback: mensaje_exitoso});
    }

    editar() {
        const {initialValues} = this.props;
        this.props.cambiarEstadoProformaAnticipo(initialValues.id, 'EDICION');
    }

    recibida() {
        const {initialValues} = this.props;
        this.props.cambiarEstadoProformaAnticipo(initialValues.id, 'RECIBIDA');
    }

    cobrada() {
        const {initialValues} = this.props;
        this.props.cambiarEstadoProformaAnticipo(initialValues.id, 'CERRADA');
    }

    anulada() {
        const {initialValues} = this.props;
        this.props.cambiarEstadoProformaAnticipo(initialValues.id, 'ANULADA');
    }

    render() {
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
        } = this.props;
        const {show_adicionar_item} = this.state;
        const editable = initialValues ? initialValues.editable : true;
        const esta_cerrada = initialValues ? initialValues.estado === 'CERRADA' : false;
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
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-3 pr-2"
                    nombre='Condición Pago'
                    name='condicion_pago'
                    disabled={!editable}
                />
                {
                    initialValues &&
                    initialValues.id &&
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_seguimiento'
                        nombre='Verificar el...'
                        className="col-12 col-md-4"
                    />
                }
                <div className='col-12'>
                    <div className="row">
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-6  pr-3"
                            nombre='Cliente'
                            name='informacion_cliente'
                            disabled={!editable}
                            case='U'/>
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-6  pr-3"
                            nombre='Locatario'
                            name='informacion_locatario'
                            disabled={!editable}
                            case='U'/>
                    </div>
                </div>
                {
                    show_adicionar_item &&
                    <div className='col-12'>
                        <NuevoItemModal
                            {...this.props}
                            adicionarItem={this.adicionarItem}
                            eliminarItem={this.eliminarItem}
                            is_open={show_adicionar_item}
                            onCancel={() => this.setState({show_adicionar_item: false})}
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
                                        onClick={() => this.setState(s => ({show_adicionar_item: !s.show_adicionar_item}))}
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
                                                            onClick={() => this.eliminarItem(e.id)}
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
                                        <td style={style.tabla.tr.td_numero}>{numeroFormato(initialValues.valor_total_sin_impuesto, 2)} {initialValues.divisa}</td>
                                        <td style={style.tabla.tr.td_icono}></td>
                                    </tr>
                                    <tr style={style.tabla.tr}>
                                        <td style={style.tabla.tr.td}>Impuesto</td>
                                        <td style={style.tabla.tr.td}></td>
                                        <td style={style.tabla.tr.td}></td>
                                        <td style={style.tabla.tr.td_numero}>{numeroFormato(initialValues.impuesto, 2)} {initialValues.divisa}</td>
                                        <td style={style.tabla.tr.td_icono}></td>
                                    </tr>
                                    <tr style={style.tabla.tr}>
                                        <td style={style.tabla.tr.td}>Valor Total</td>
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
                                onClick={() => this.imprimirCobro()}
                                disabled={!(submitting || pristine)}
                            >
                                Imprimir Comprobante
                            </Button>
                            {
                                !esta_cerrada &&
                                <Button
                                    color="primary"
                                    onClick={() => this.enviarPorEmail()}
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
                                    onClick={() => this.editar()}
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
                                    onClick={() => this.recibida()}
                                    disabled={!(submitting || pristine)}
                                >
                                    Recibida
                                </Button>
                            }
                            {
                                !editable &&
                                !esta_cerrada &&
                                <Button
                                    color="primary"
                                    onClick={() => this.cobrada()}
                                    disabled={!(submitting || pristine)}
                                >
                                    Cobrada
                                </Button>
                            }
                        </div>
                    </Fragment>
                }
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "proformaAnticipoForm",
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;