import React, {Fragment, memo, useContext, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {pesosColombianos, fechaFormatoUno} from "../../../00_utilities/common";
import {Link} from 'react-router-dom'
import * as actions from '../../../01_actions/01_index';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import DialogSeleccionar from '../../../00_utilities/components/ui/search_and_select/SearchAndSelect';
import StylesContext from "../../../00_utilities/contexts/StylesContext";


const CotizacionInfo = memo(props => {
    const {object, permisos_proyecto, permisos_cotizacion} = props;
    const {table} = useContext(StylesContext);
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
            <div className="col-12">
                <strong>Descripción: </strong> {object.descripcion_cotizacion}<br/>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <strong>Cliente: </strong> {object.cliente_nombre}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <strong>Contacto: </strong> {object.contacto}
            </div>
            {cotizacion_inicial &&
            <div className="col-12">
                <strong>Cotización Inicial: </strong>
                <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion_inicial.id}`}>
                    {cotizacion_inicial.unidad_negocio}-{cotizacion_inicial.nro_cotizacion}
                </Link>
            </div>}
            <div className="col-12">
                <table className='table table-responsive table-striped'>
                    <thead>
                    <tr style={table.tr}>
                        <th style={table.td}></th>
                        <th style={table.td}>Valor OC.</th>
                        <th style={table.td}>Costo Pre.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={table.tr}>
                        <td style={table.td}>Cotización</td>
                        <td style={table.td_right}>{pesosColombianos(object.valor_orden_compra)}</td>
                        <td style={table.td_right}>{pesosColombianos(object.costo_presupuestado)}</td>
                    </tr>
                    {(object.valor_orden_compra_adicionales > 0 ||
                        object.costo_presupuestado_adicionale > 0) &&
                    <Fragment>
                        <tr style={table.tr}>
                            <td style={table.td}>Cotizaciones Adicionales</td>
                            <td style={table.td_right}>{pesosColombianos(object.valor_orden_compra_adicionales)}</td>
                            <td style={table.td_right}>{pesosColombianos(object.costo_presupuestado_adicionales)}</td>
                        </tr>
                    </Fragment>
                    }
                    </tbody>
                    <tfoot>
                    <tr style={table.tr}>
                        <td style={table.td}>Total</td>
                        <td style={table.td_right}>{pesosColombianos(object.valor_orden_compra + object.valor_orden_compra_adicionales)}</td>
                        <td style={table.td_right}>{pesosColombianos(object.costo_presupuestado + object.costo_presupuestado_adicionales)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <strong>Fecha Entrega
                            Cotización: </strong>{object.fecha_entrega_pactada_cotizacion ? fechaFormatoUno(object.fecha_entrega_pactada_cotizacion) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Nro Orden Compra: </strong>{object.orden_compra_nro}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Fecha Orden
                            Compra: </strong>{object.orden_compra_fecha ? fechaFormatoUno(object.orden_compra_fecha) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Fecha Entrega
                            Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
                    </div>
                </div>
            </div>
            <div className="col-12 mt-3">
                <strong>Observación: </strong> {object.observacion}<br/>
                <strong>Estado: </strong> {object.estado} <br/>
                <strong>Contacto: </strong>
                {
                    object.contacto_cliente &&
                    <Fragment>
                        <Link
                            to={`/app/ventas_proyectos/clientes/clientes/detail/${object.cliente}`}>{object.contacto_cliente_nombre}
                        </Link><br/>
                    </Fragment>
                }
                {
                    object.estado === 'Cierre (Aprobado)' &&
                    !es_adicional &&
                    <Fragment>
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
                                    className='col-6 col-sm-4 col-md-3 col-lg-2'
                                >
                                    <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                                        {c.unidad_negocio}-{c.estado === 'Cierre (Aprobado)' ? c.nro_cotizacion : c.estado}
                                    </Link>
                                </div>)}
                            </div>
                        </div>}
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
                                    className='col-6 col-sm-4 col-md-3 col-lg-2'
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
                    </Fragment>
                }
                {object.responsable &&
                <Fragment><strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                    <br/></Fragment>}
            </div>
            {
                relacionar_proyecto &&
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
                />
            }
        </div>
    )
});

export default CotizacionInfo;