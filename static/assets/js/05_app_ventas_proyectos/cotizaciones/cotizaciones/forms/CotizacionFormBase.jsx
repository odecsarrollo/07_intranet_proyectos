import React, {Fragment, useEffect} from 'react';
import {
    MyTextFieldSimple,
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
        change = null,
        permisos = null
    } = props;
    const {cotizacion_inicial} = myValues;
    const dispatch = useDispatch();
    const change_cerrada = permisos ? permisos.change_cerrada : false;
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
        estado === 'Aplazado'
        || estado === 'Cancelado'
        || estado === 'Evaluación Técnica y Económica'
    );
    const en_proceso = estado && estado !== 'Cita/Generación Interés' && estado !== 'Aplazado' && estado !== 'Perdido' && estado !== 'Cancelado';
    let estados_lista = [
        'Cita/Generación Interés',
        'Configurando Propuesta',
        'Cotización Enviada',
        'Evaluación Técnica y Económica',
        'Aceptación de Terminos y Condiciones',
        //'Cierre (Aprobado)',
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
    let origenes_cotizacion = [
        'Comercial',
        'Mercadeo',
        'Gerencia',
        'Componentes',
        'Técnico',
    ];
    let tipo_negocio = [
        {id: 'TRP', text: 'TRP - TRANSPORTADOR'},
        {id: 'EQR', text: 'EQR - EQUIPOS REPRESENTADOS'},
        {id: 'SER', text: 'SER - SERVICIOS'},
        {id: 'EQO', text: 'EQO - EQUIPO ODECOPACK'},
        {id: 'SOL', text: 'SOL - SOLUCIONES'},
    ];
    if (!item) {
        tipo_negocio = [...tipo_negocio, {id: 'ADI', text: 'ADI - ADICIONAL'}]
    }
    const cotizacion_a_relacionar = cotizacion_inicial ? cotizaciones_encontradas[cotizacion_inicial] : null;
    estados_lista = estados_lista.map(e => ({id: e, name: e}));
    origenes_cotizacion = origenes_cotizacion.map(e => ({id: e, name: e}));
    const en_cita_generacion_interes = estado === 'Cita/Generación Interés';
    const en_configurando_propuesta = estado === 'Configurando Propuesta';
    const en_cotizacion_enviada = estado === 'Cotización Enviada';
    const en_evaluacion_tecnica_economica = estado === 'Evaluación Técnica y Económica';
    const en_aceptacion_terminos_condiciones = estado === 'Aceptación de Terminos y Condiciones';
    const en_cierre = estado === 'Cierre (Aprobado)';
    const cerrado = item && item.estado === 'Cierre (Aprobado)' && !change_cerrada;
    const en_aplazado = estado === 'Aplazado';
    const en_cancelado = estado === 'Cancelado';
    const buscarCotizacion = (busqueda) => dispatch(actions.fetchCotizacionesxParametro(busqueda));
    useEffect(() => {
        dispatch(actions.fetchClientes());
        return () => {
            dispatch(actions.clearClientes());
        }
    }, []);

    useEffect(() => {
        if (item && item.cliente_id) {
            dispatch(actions.fetchContactosClientes_por_cliente(item.cliente_id));
        }
        return () => {
            dispatch(actions.clearContactosClientes());
        }
    }, []);
    useEffect(() => {
        if (cotizacion_a_relacionar) {
            dispatch(actions.fetchContactosClientes_por_cliente(cotizacion_a_relacionar.cliente, {
                callback: () => {
                    change('cliente', cotizacion_a_relacionar.cliente);
                }
            }));
        }
    }, [cotizacion_inicial]);
    useEffect(() => {
        if (myValues.unidad_negocio !== 'ADI') {
            change('cotizacion_inicial', null)
        }
    }, [myValues.unidad_negocio]);
    return (
        <Fragment>
            {buscar_cotizacion_inicial_modal_open && <DialogSeleccionar
                min_caracteres={4}
                placeholder='Cotización a buscar'
                id_text='id'
                onCancelar={() => {
                    change('unidad_negocio', null);
                    change('cotizacion_inicial', null);
                }}
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
                            {!item && !es_adicional && <MyCheckboxSimple
                                className="col-6 pt-4"
                                name='subir_anterior'
                                label='subir anterior'
                            />}
                            {subir_anterior && <MyTextFieldSimple
                                className="col-6"
                                nombre='Nro. Cotización'
                                name='nro_cotizacion'
                                type='number'
                            />}
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className="row">
                            <MyCombobox
                                label_space_xs={4}
                                label='Unidad de Negocio'
                                className="col-12 col-md-6"
                                name='unidad_negocio'
                                busy={false}
                                autoFocus={false}
                                data={tipo_negocio}
                                readOnly={(item && es_adicional) || cerrado}
                                textField='text'
                                filter='contains'
                                valuesField='id'
                                placeholder='Tipo de Negocio'
                            />
                            <MyCombobox
                                label_space_xs={4}
                                label='Origen Cotización'
                                className='col-12 col-md-6'
                                name='origen_cotizacion'
                                busy={false}
                                autoFocus={false}
                                data={origenes_cotizacion}
                                readOnly={cerrado}
                                textField='name'
                                filter='contains'
                                valuesField='id'
                                placeholder='Origen Cotización'
                            />
                        </div>
                    </div>
                    {myValues.unidad_negocio && <div className='col-12'>
                        <div className="row">
                            <MyCombobox
                                label='Cliente'
                                label_space_xs={3}
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
                                readOnly={cerrado || es_adicional}
                            />
                            {myValues && myValues.cliente && <MyCombobox
                                label='Contacto'
                                label_space_xs={3}
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
                                readOnly={cerrado}
                            />}
                        </div>
                    </div>}
                </div>
            </div>
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion_cotizacion'
                disabled={cerrado}
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
            {item && <MyTextFieldSimple
                className="col-12"
                nombre='Observación'
                name='observacion'
                disabled={cerrado}
                multiline={true}
                rows={2}
                case='U'/>}
            {(item || subir_anterior) && <MyCombobox
                label_space_xs={3}
                className='col-12 col-md-6'
                name='estado'
                label='Estado'
                busy={false}
                autoFocus={false}
                data={estados_lista}
                readOnly={cerrado}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Seleccionar Estado...'
            />}
            {!en_aceptacion_terminos_condiciones && item && <MyDateTimePickerField
                label='Verificar el...'
                label_space_xs={4}
                max={new Date(2099, 11, 31)}
                name='fecha_limite_segumiento_estado'
                className="col-12 col-md-3"
                readOnly={cerrado}
            />}
            {!en_cita_generacion_interes && !en_cancelado && !en_aplazado && item &&
            <MyDateTimePickerField
                label='Fecha Pactada Entrega Cotización'
                label_space_xs={4}
                max={new Date(2099, 11, 31)}
                name='fecha_entrega_pactada_cotizacion'
                className='col-12 col-md-3'
                readOnly={cerrado}
            />
            }
            {!en_cita_generacion_interes && !en_configurando_propuesta && !en_cancelado && !en_aplazado && item &&
            <Fragment>
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-4"
                    nombre='Valor Oferta'
                    name='valor_ofertado'
                    disabled={cerrado}
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-4"
                    nombre='Costo Presupuestado'
                    name='costo_presupuestado'
                    disabled={cerrado}
                />
            </Fragment>}
            {(en_aceptacion_terminos_condiciones || en_cierre) && <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Nro. Días Entrega'
                name='dias_pactados_entrega_proyecto'
                disabled={cerrado}
                type='number'
            />}
            {comentario_estado && <MyTextFieldSimple
                className="col-12"
                nombre='Observación Estado'
                name='estado_observacion_adicional'
                disabled={cerrado}
                case='U'/>}
        </Fragment>
    )
};

export default FormBaseCotizacion;