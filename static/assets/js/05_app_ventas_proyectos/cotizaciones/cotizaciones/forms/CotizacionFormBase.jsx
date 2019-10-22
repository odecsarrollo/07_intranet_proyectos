import React, {Fragment, useEffect} from 'react';
import {
    MyTextFieldSimple,
    MyDropdownList,
    MyDateTimePickerField,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from 'react-redux';
import DialogSeleccionar from "../../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import * as actions from "../../../../01_actions/01_index";
import Typography from "@material-ui/core/Typography";


const FormBaseCotizacion = (props) => {
    const {
        item = null,
        myValues,
        change = null
    } = props;
    const {cotizacion_inicial} = myValues;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.fetchClientes());
        return () => {
            dispatch(actions.clearClientes());
        }
    }, []);

    useEffect(() => {
        if (item) {
            dispatch(actions.fetchContactosClientes_por_cliente(item.cliente_id));
        }
        return () => {
            dispatch(actions.clearContactosClientes());
        }
    }, []);

    const buscarCotizacion = (busqueda) => dispatch(actions.fetchCotizacionesxParametro(busqueda));
    const cargarContactosCliente = (cliente_id = null) => {
        if (cliente_id) {
            dispatch(actions.fetchContactosClientes_por_cliente(cliente_id));
        }
    };

    const clientes_list = useSelector(state => state.clientes);
    const contactos_list = useSelector(state => state.clientes_contactos);

    const cotizaciones_encontradas = useSelector(state => state.cotizaciones);
    const es_adicional = myValues.unidad_negocio && myValues.unidad_negocio === 'ADI';
    const buscar_cotizacion_inicial_modal_open = !cotizacion_inicial && es_adicional && !item;
    const {estado, subir_anterior} = myValues;
    const comentario_estado = estado && (
        estado === 'Evaluación Técnica y Económinca'
        || estado === 'Aceptación de Terminos y Condiciones'
        || estado === 'Perdido'
        || estado === 'Aplazado'
        || estado === 'Cancelado'
    );
    const esta_aprobado = estado === 'Cierre (Aprobado)';
    const en_proceso = estado && estado !== 'Cita/Generación Interés' && estado !== 'Aplazado' && estado !== 'Perdido' && estado !== 'Cancelado';
    const enviado = en_proceso && estado !== 'Configurando Propuesta';
    const pedir_dias_espera_cambio_estado = (
        estado !== 'Cierre (Aprobado)' &&
        estado !== 'Perdido' &&
        estado !== 'Cancelado'
    );
    let estados_lista = [
        'Cita/Generación Interés',
        'Configurando Propuesta',
        'Cotización Enviada',
        'Evaluación Técnica y Económica',
        'Aceptación de Terminos y Condiciones',
        'Cierre (Aprobado)',
        'Aplazado',
        'Cancelado',
        //'Perdido',
    ];
    if (subir_anterior) {
        estados_lista = [
            'Cita/Generación Interés',
            'Configurando Propuesta',
            'Cotización Enviada',
            'Evaluación Técnica y Económica',
            'Aceptación de Terminos y Condiciones'
        ];
    }
    let tipo_negocio = [
        {id: 'TRP', text: 'TRP - TRANSPORTADOR'},
        {id: 'EQR', text: 'EQR - EQUIPOS REPRESENTADOS'},
        {id: 'SER', text: 'SER - SERVICIOS'},
        {id: 'EQO', text: 'TRP - EQUIPO ODECOPACK'},
        {id: 'SOL', text: 'SOL - SOLUCIONES'},
    ];
    if (!item) {
        tipo_negocio = [...tipo_negocio, {id: 'ADI', text: 'ADI - ADICIONAL'}]
    }
    const cotizacion_a_relacionar = cotizacion_inicial ? cotizaciones_encontradas[cotizacion_inicial] : null;
    return (
        <Fragment>
            {buscar_cotizacion_inicial_modal_open &&
            <DialogSeleccionar
                min_caracteres={4}
                placeholder='Cotización a buscar'
                id_text='id'
                selected_item_text='nro_cotizacion'
                onSearch={buscarCotizacion}
                onSelect={(id) => change('cotizacion_inicial', id)}
                listado={_.map(_.pickBy(cotizaciones_encontradas, e => e.estado === 'Cierre (Aprobado)' && e.unidad_negocio !== 'ADI'), c => ({
                    id: c.id,
                    nro_cotizacion: `${c.unidad_negocio}-${c.nro_cotizacion}`
                }))}
                open={buscar_cotizacion_inicial_modal_open}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Cotización Inicial'}
            />}
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            {
                                !item &&
                                !es_adicional &&
                                <MyCheckboxSimple
                                    className="col-6 pt-4"
                                    name='subir_anterior'
                                    nombre='subir anterior'
                                />
                            }
                            {
                                subir_anterior &&
                                <MyTextFieldSimple
                                    className="col-6"
                                    nombre='Nro. Cotización'
                                    name='nro_cotizacion'
                                    type='number'
                                />
                            }
                        </div>
                    </div>
                    <MyCombobox
                        className="col-12"
                        name='unidad_negocio'
                        busy={false}
                        autoFocus={false}
                        data={tipo_negocio}
                        readOnly={item && es_adicional}
                        textField='text'
                        filter='contains'
                        valuesField='id'
                        placeholder='Tipo de Negocio'
                    />
                    {!es_adicional &&
                    <Fragment>
                        <MyCombobox
                            className="col-12 col-md-6"
                            name='cliente'
                            data={_.map(_.orderBy(clientes_list, ['nombre'], ['asc']), e => {
                                return {
                                    'name': e.nombre,
                                    'id': e.id
                                }
                            })}
                            textField='name'
                            valuesField='id'
                            placeholder='Cliente'
                            filter='contains'
                            onSelect={(v) => cargarContactosCliente(v.id)}
                        />
                        {
                            myValues && myValues.cliente &&
                            <MyCombobox
                                className="col-12 col-md-6"
                                name='contacto_cliente'
                                data={_.map(_.orderBy(contactos_list, ['full_nombre'], ['asc']), e => {
                                    return {
                                        'name': e.full_nombre,
                                        'id': e.id
                                    }
                                })}
                                textField='name'
                                filter='contains'
                                valuesField='id'
                                placeholder='Contacto'
                            />
                        }
                    </Fragment>
                    }
                </div>
            </div>
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion_cotizacion'
                case='U'/>
            {cotizacion_a_relacionar &&
            <div className="col-12" style={{border: '1px solid black', borderRadius: '10px'}}>
                <Typography variant="h6" color="inherit" gutterBottom>
                    Cotización Inicial
                </Typography>
                <strong>{cotizacion_a_relacionar.unidad_negocio}-{cotizacion_a_relacionar.nro_cotizacion}:</strong> {cotizacion_a_relacionar.descripcion_cotizacion}
                <br/>
                <strong>Cliente:</strong> {cotizacion_a_relacionar.cliente_nombre}
                <br/>
                <strong>Contacto:</strong> {cotizacion_a_relacionar.contacto_cliente_nombre}
            </div>}
            {
                item && !item.contacto_cliente &&
                <MyTextFieldSimple
                    className="col-12 col-md-12 col-lg-5"
                    nombre='Contacto'
                    name='contacto'
                    disabled={item && es_adicional}
                    case='U'/>
            }
            <MyDropdownList
                className='col-12 col-md-8'
                name='origen_cotizacion'
                label='Origen Cotización'
                data={[
                    'Comercial',
                    'Mercadeo',
                    'Gerencia',
                    'Componentes',
                    'Técnico',
                ]}
            />
            <MyTextFieldSimple
                className="col-12"
                nombre='Observación'
                name='observacion'
                multiline={true}
                rows={2}
                case='U'/>
            <MyDateTimePickerField
                max={new Date(2099, 11, 31)}
                name='fecha_entrega_pactada_cotizacion'
                nombre='Fecha Entrega Cotización'
                className='col-12 col-md-6 col-lg-4'
            />
            {
                !item && !subir_anterior &&
                <MyDateTimePickerField
                    max={new Date(2099, 11, 31)}
                    name='fecha_limite_segumiento_estado'
                    nombre='Verificar el...'
                    className="col-12 col-md-4"
                />
            }
            {
                (item || subir_anterior) &&
                <Fragment>
                    <div className="col-12">
                        <div className="row mb-4">
                            <MyDropdownList
                                className='col-12 col-md-8'
                                name='estado'
                                label='Estado'
                                data={estados_lista}
                            />
                            {
                                pedir_dias_espera_cambio_estado &&
                                <MyDateTimePickerField
                                    max={new Date(2099, 11, 31)}
                                    name='fecha_limite_segumiento_estado'
                                    nombre='Verificar el...'
                                    className="col-12 col-md-4"
                                />
                            }
                        </div>
                    </div>
                </Fragment>
            }
            {
                comentario_estado &&
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Observación Estado'
                    name='estado_observacion_adicional'
                    case='U'/>
            }
            {
                enviado &&
                <Fragment>
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Valor Oferta'
                        name='valor_ofertado'
                    />
                </Fragment>
            }
            {
                esta_aprobado &&
                <Fragment>
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_entrega_pactada'
                        nombre='Fecha Entrega Proyecto'
                        className='col-12 col-md-6 col-lg-4'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Costo Presupuestado'
                        name='costo_presupuestado'
                    />
                    <div className='col-12'>
                        <div className="row">
                            <div className='col-12 mt-2'>
                                <h3>Orden de Compra</h3>
                            </div>
                            <MyDateTimePickerField
                                max={new Date(2099, 11, 31)}
                                name='orden_compra_fecha'
                                nombre='Fecha Orden de Compra'
                                className='col-12 col-md-4'
                            />
                            <MyTextFieldSimple
                                className="col-12 col-md-4"
                                nombre='Valor OC'
                                name='valor_orden_compra'
                            />
                            <MyTextFieldSimple
                                className="col-12 col-md-4"
                                nombre='Nro. Orden Compra'
                                name='orden_compra_nro'
                                case='U'/>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
};

export default FormBaseCotizacion;