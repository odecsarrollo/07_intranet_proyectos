import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as actions from "../../01_actions/01_index";
import CotizacionAbrirCarpetaLista from "../proyectos/proyectos/ProyectoCrearDesdeCotizacion";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES, PROYECTOS} from "../../permisos";

const ConsecutivoProyectoTablaItem = props => {
    const {
        proyecto,
        proyecto: {
            cotizaciones,
            mis_literales,
            cotizacion_componentes_nro_cotizacion,
            cotizacion_componentes_nro_orden_compra,
        },
        permisos_proyectos,
        permisos_cotizaciones
    } = props;
    let cotizaciones_adicionales = [];
    cotizaciones.map(c => {
        cotizaciones_adicionales = [...cotizaciones_adicionales, c]
    });
    cotizaciones.filter(c => c.cotizaciones_adicionales.length > 0).map(e => {
        e.cotizaciones_adicionales.map(ca => {
            cotizaciones_adicionales = [...cotizaciones_adicionales, ca]
        });
    });
    return (
        <div className="row">
            <div className="col-1">
                {permisos_proyectos.detail ? <Link
                    target='_blank'
                    to={`/app/proyectos/proyectos/detail/${proyecto.id}`}>
                    {proyecto.id_proyecto}
                </Link> : proyecto.id_proyecto}
            </div>
            <div className="col-1">{cotizaciones.map(cotizacion =>
                <div className="row" key={cotizacion.id}>
                    <div className="col-12">
                        {permisos_cotizaciones.detail ? <Link
                            target='_blank'
                            to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion.id}`}>
                            {cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}
                        </Link> : <div>{cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}</div>}
                    </div>
                </div>)}
            </div>
            <div className="col-1">{proyecto.cliente_nombre}</div>
            <div className="col-9">
                {(cotizaciones_adicionales.length > 0 || cotizacion_componentes_nro_cotizacion || cotizacion_componentes_nro_orden_compra) &&
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-2"></div>
                    <div className="col-1"></div>
                    <div className="col-6">
                        {(cotizacion_componentes_nro_orden_compra || cotizacion_componentes_nro_cotizacion) &&
                        <div className="row">
                            <div className="col-4">{cotizacion_componentes_nro_orden_compra}</div>
                            <div className="col-4">{cotizacion_componentes_nro_cotizacion}</div>
                            <div className="col-4"></div>
                        </div>}
                        {_.map(cotizaciones_adicionales, c => <div className="row" key={c.id}>
                            <div className="col-4">
                                {permisos_cotizaciones.detail ? <Link
                                    target='_blank'
                                    to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                                    {c.unidad_negocio}-{c.nro_cotizacion}
                                </Link> : <div>{c.unidad_negocio}-{c.nro_cotizacion}</div>}
                            </div>
                            <div className="col-4">
                                {c.orden_compra_archivo_url ?
                                    <a href={c.orden_compra_archivo_url}
                                       target='_blank'>{c.orden_compra_nro}</a> : c.orden_compra_nro}
                            </div>
                            <div className="col-4">
                                {c.fecha_entrega_pactada} {`${c.dias_para_vencer ? `(${c.dias_para_vencer} días)` : ''}`}
                            </div>
                        </div>)}
                    </div>
                </div>}
                {mis_literales.map(literal => <div className="row" key={literal.id}>
                    <div className="col-3">{literal.id_literal} - {literal.descripcion}</div>
                    <div className="col-2">{literal.disenador_nombre}</div>
                    <div className="col-1 text-center">{literal.abierto ?
                        <FontAwesomeIcon icon={'check-circle'}/> : ''}</div>
                    {literal.cotizaciones &&
                    <div className="col-6">
                        {literal.cotizaciones.map(cotizacion =>
                            <div key={cotizacion.id} className='row'>
                                <div className="col-4">
                                    {permisos_cotizaciones.detail ? <Link
                                        target='_blank'
                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion.id}`}>
                                        {cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}
                                    </Link> : <div>{cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}</div>}
                                </div>
                                <div className="col-4">
                                    {cotizacion.orden_compra_archivo_url ?
                                        <a href={cotizacion.orden_compra_archivo_url}
                                           target='_blank'>{cotizacion.orden_compra_nro}</a> : cotizacion.orden_compra_nro}
                                </div>
                                <div
                                    className="col-4">{cotizacion.fecha_entrega_pactada} {`${cotizacion.dias_para_vencer ? `(${cotizacion.dias_para_vencer} días)` : ''}`}
                                </div>
                            </div>)}
                    </div>}
                </div>)}
            </div>
        </div>
    )
};

const ConsecutivoProyectoTabla = (props) => {
    let {list} = props;
    const [busqueda, setBusqueda] = useState('');
    const [busqueda_tipo_proyecto, setBusquedaTipoProyecto] = useState('OP');
    const [busqueda_abierto, setBusquedaAbierto] = useState('SI');
    const [rangos_proyectos, setRangosProyectos] = useState({});
    const [rango_actual, setRangoActual] = useState(null);
    const opciones = ['OP', 'OS', 'OO'];
    const permisos_cotizaciones = useTengoPermisos(COTIZACIONES);
    const permisos_proyectos = useTengoPermisos(PROYECTOS);

    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProyectosConsecutivo(busqueda_tipo_proyecto, busqueda_abierto, rango_actual))
    };
    useEffect(() => {
        dispatch(actions.fetchProyectosConsecutivosRangos({
            callback: res => {
                setRangosProyectos(res.lista);
                setRangoActual(res.lista[busqueda_tipo_proyecto][0])
            }
        }))
    }, []);

    useEffect(() => {
        if (rango_actual) {
            cargarDatos();
        }
        return () => dispatch(actions.clearProyectos());
    }, [rango_actual, busqueda_abierto]);
    if (busqueda_tipo_proyecto !== 'TODO') {
        list = _.pickBy(list, proyecto => proyecto.id_proyecto.substring(0, 2) === busqueda_tipo_proyecto)
    }
    if (busqueda_abierto !== 'TODO') {
        list = _.pickBy(
            list,
            proyecto => proyecto.mis_literales.filter(
                l => l.abierto === (busqueda_abierto === 'SI')
                ).length > 0 ||
                proyecto.mis_literales.length === 0
        )
    }
    let literales_sin_sincronizar = [];
    _.map(list, proyecto => {
        proyecto.mis_literales.map(l => {
            literales_sin_sincronizar = [...literales_sin_sincronizar, l]
        })

    });
    literales_sin_sincronizar = literales_sin_sincronizar.filter(e => !e.en_cguno);


    if (busqueda !== '') {
        list = _.pickBy(list, proyecto => {
                const contiene = texto => texto && texto.toLowerCase().includes(busqueda.toLowerCase());
                const tiene_proyecto = contiene(proyecto.id_proyecto);
                const tiene_cotizacion = proyecto.cotizaciones.filter(c => contiene(c.orden_compra_nro) || contiene(`${c.unidad_negocio}-${c.nro_cotizacion}`)).length > 0;
                const tiene_literal = proyecto.mis_literales.filter(l => {
                    return contiene(l.descripcion) ||
                        contiene(l.id_literal) ||
                        l.cotizaciones.filter(c => contiene(c.orden_compra_nro) || contiene(`${c.unidad_negocio}-${c.nro_cotizacion}`)).length > 0
                }).length > 0;
                const tiene_disenador = proyecto.mis_literales.filter(l => l.disenador && contiene(l.disenador_nombre)).length > 0;
                const tiene_cliente = proyecto.cliente_nombre && contiene(proyecto.cliente_nombre);
                return tiene_proyecto || tiene_cotizacion || tiene_literal || tiene_cliente || tiene_disenador
            }
        );
    }
    return (
        <div>
            {(permisos_cotizaciones.list_cotizaciones_abrir_carpeta ||
                permisos_cotizaciones.list_cotizaciones_notificaciones_consecutivo_proyectos) &&
            <CotizacionAbrirCarpetaLista
                literales_sin_sincronizar={literales_sin_sincronizar}
            />}
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <TextField
                        fullWidth={true}
                        label='Busqueda'
                        margin="normal"
                        onChange={e => setBusqueda(e.target.value)}
                        value={busqueda}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <div className="row">
                        <div className="col-3">Literales Abiertos:</div>
                        <div className="col-1"
                             style={{backgroundColor: busqueda_abierto === 'SI' ? '#ff9800' : 'transparent'}}>
                            <span className='puntero' onClick={() => setBusquedaAbierto('SI')}>SI</span>
                        </div>
                        <div className="col-1"
                             style={{backgroundColor: busqueda_abierto === 'NO' ? '#ff9800' : 'transparent'}}>
                            <span className='puntero' onClick={() => setBusquedaAbierto('NO')}>NO</span>
                        </div>
                        <div className="col-1"
                             style={{backgroundColor: busqueda_abierto === 'TODO' ? '#ff9800' : 'transparent'}}>
                            <span className='puntero' onClick={() => setBusquedaAbierto('TODO')}>TODO</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">Tipo de Proyecto:</div>
                        {opciones.map(o => <div
                            key={o}
                            className='col-1'
                            style={{backgroundColor: busqueda_tipo_proyecto === o ? '#ff9800' : 'transparent'}}
                        >
                            <span
                                className='puntero'
                                onClick={() => {
                                    setBusquedaTipoProyecto(o);
                                    setRangoActual(null);
                                }}>
                                {o}
                            </span>
                        </div>)}
                    </div>
                    {rangos_proyectos[busqueda_tipo_proyecto] && <div className="row">
                        <div className="col-3">Rango Consecutivo:</div>
                        {rangos_proyectos[busqueda_tipo_proyecto].map(o => <div
                            key={o}
                            className='col-1'
                            style={{backgroundColor: rango_actual === o ? '#ff9800' : 'transparent'}}
                        >
                            <span
                                className='puntero'
                                onClick={() => setRangoActual(o)}>
                                {o}
                            </span>
                        </div>)}
                        <div
                            className="col-1"
                            style={{backgroundColor: rango_actual === 'TODO' ? '#ff9800' : 'transparent'}}
                        >
                            <span
                                className='puntero'
                                onClick={() => setRangoActual('TODO')}
                            >
                                TODO
                            </span>
                        </div>
                    </div>}
                    <div className="row">
                        <div className="col-3">Nro Proyectos:</div>
                        {_.size(list)}
                    </div>
                </div>
            </div>
            <div className='row consecutivo_proyectos'>
                <div className="col-12 header">
                    <div className="row">
                        <div className="col-1">OP</div>
                        <div className="col-1">Cot. Ini</div>
                        <div className="col-1">Cliente</div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-3">Literal</div>
                                <div className="col-2">Diseñador</div>
                                <div className="col-1">Activo</div>
                                <div className="col-2">Cot.</div>
                                <div className="col-2">#OC</div>
                                <div className="col-2">#Fecha Entrega</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 body">
                    {_.map(list, proyecto => <ConsecutivoProyectoTablaItem
                        key={proyecto.id}
                        proyecto={proyecto}
                        permisos_proyectos={permisos_proyectos}
                        permisos_cotizaciones={permisos_cotizaciones}
                    />)}
                </div>
            </div>
        </div>
    );
};

export default ConsecutivoProyectoTabla;