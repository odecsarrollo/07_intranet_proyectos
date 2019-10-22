import React, {Fragment, memo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fechaFormatoUno} from "../../../00_utilities/common";
import {Link} from 'react-router-dom'
import * as actions from '../../../01_actions/01_index';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import DialogSeleccionar from '../../../00_utilities/components/ui/search_and_select/SearchAndSelect';
import CotizacionDetailInfoValoresTable from './CotizacionDetailInfoValoresTable';

const CotizacionInfo = memo(props => {
    const {object, permisos_proyecto, permisos_cotizacion} = props;
    const {cotizacion_inicial} = object;
    const [relacionar_proyecto, setRelacionarProyecto] = useState(false);
    const dispatch = useDispatch();
    const relacionarQuitarProyecto = (proyecto_id) => dispatch(actions.relacionarQuitarProyectoaCotizacion(object.id, proyecto_id));
    const buscarProyecto = (busqueda) => {
        dispatch(actions.fetchProyectosxParametro(busqueda));
    };
    let proyectos_list = useSelector(state => state.proyectos);
    proyectos_list = _.pickBy(proyectos_list, p => !object.proyectos.map(e => e.id).includes(p.id));
    const es_adicional = object.unidad_negocio === 'ADI';
    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                <strong>Descripción: </strong> {object.descripcion_cotizacion}
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <strong>Cliente: </strong> {object.cliente_nombre}
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <strong>Contacto: </strong>
                {object.contacto_cliente_nombre &&
                <Fragment>
                    <Link
                        to={`/app/ventas_proyectos/clientes/clientes/detail/${object.cliente}`}>{object.contacto_cliente_nombre}
                    </Link><br/>
                </Fragment>}
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Entrega
                            Cotización: </strong>{object.fecha_entrega_pactada_cotizacion ? fechaFormatoUno(object.fecha_entrega_pactada_cotizacion) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Orden
                            Compra: </strong>{object.orden_compra_fecha ? fechaFormatoUno(object.orden_compra_fecha) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Entrega
                            Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Nro Orden Compra: </strong>{object.orden_compra_nro}
                    </div>
                </div>
            </div>
            {cotizacion_inicial &&
            <div className="col-12">
                <strong>Cotización Inicial: </strong>
                <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion_inicial.id}`}>
                    {cotizacion_inicial.unidad_negocio}-{cotizacion_inicial.nro_cotizacion}
                </Link>
            </div>}
            <div className="col-12 col-lg-3">
                <CotizacionDetailInfoValoresTable cotizacion={object}/>
            </div>
            {
                object.estado === 'Cierre (Aprobado)' &&
                !es_adicional && <Fragment>
                    <div className="col-12 col-lg-5">
                        {object.cotizaciones_adicionales.length > 0 &&
                        <div style={{
                            borderRadius: '5px',
                            border: 'solid black 1px',
                            padding: '5px',
                            marginBottom: '10px'
                        }}>
                            <strong>Cotizaciones Adicionales: </strong>
                            <div className='row'>
                                {_.orderBy(object.cotizaciones_adicionales, ['nro_cotizacion', 'asc']).map(c => <div
                                    key={c.id}
                                    style={{position: 'relative'}}
                                    className='col-6 col-sm-4 col-md-3'
                                >
                                    <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                                        {c.unidad_negocio}-{c.estado === 'Cierre (Aprobado)' ? c.nro_cotizacion : c.estado}
                                    </Link>
                                </div>)}
                            </div>
                        </div>}
                    </div>
                    <div className="col-12 col-lg-4">
                        <div style={{borderRadius: '5px', border: 'solid black 1px', padding: '5px'}}>
                            <strong>Proyectos: </strong>
                            {
                                (!object.mi_proyecto && !object.mi_literal_id_literal) &&
                                permisos_cotizacion.change &&
                                !relacionar_proyecto &&
                                <span>{object.id_proyecto ? object.id_proyecto :
                                    <span className='puntero'
                                          style={{color: 'red'}}
                                          onClick={() => setRelacionarProyecto(true)}
                                    >
                                Relacionar
                            </span>
                                }</span>
                            }
                            <br/>
                            {object.proyectos.length > 0 && <div className='row'>
                                {_.orderBy(object.proyectos, ['id_proyecto', 'asc']).map(p => <div
                                    key={p.id}
                                    style={{position: 'relative'}}
                                    className='col-6 col-sm-4 col-md-3'
                                >
                                    <Link
                                        to={`/app/proyectos/proyectos/detail/${p.id}`}>{p.id_proyecto}
                                    </Link>
                                    <MyDialogButtonDelete
                                        style={{position: 'absolute', left: '80px', top: '0'}}
                                        element_name={''}
                                        element_type={`la relación de la cotizacion con el proyecto ${p.id_proyecto}`}
                                        onDelete={() => relacionarQuitarProyecto(p.id)}
                                    />
                                </div>)}
                            </div>}
                        </div>
                    </div>
                </Fragment>
            }

            {object.responsable_nombres &&
            <div className='col-12'>
                <strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                <br/></div>}

            {object.observacion &&
            <div className='col-12'><strong>Observación: </strong> {object.observacion}</div>}

            {relacionar_proyecto &&
            <DialogSeleccionar
                placeholder='Proyecto a buscar'
                id_text='id'
                selected_item_text='id_proyecto'
                onSearch={buscarProyecto}
                onSelect={relacionarQuitarProyecto}
                onCancelar={() => setRelacionarProyecto(false)}
                listado={_.map(proyectos_list)}
                open={relacionar_proyecto}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Proyecto'}
            />}
        </div>
    )
});

export default CotizacionInfo;