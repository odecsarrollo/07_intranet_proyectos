import React, {useState} from 'react';
import {Link} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CotizacionAbrirCarpetaLista from "../proyectos/proyectos/ProyectoCrearDesdeCotizacion";

const ConsecutivoProyectoTabla = (props) => {
    let {list, cargarDatos} = props;
    const [busqueda, setBusqueda] = useState('');
    const [busqueda_tipo_proyecto, setBusquedaTipoProyecto] = useState('TODO');
    const [busqueda_abierto, setBusquedaAbierto] = useState('TODO');
    const opciones = _.uniq(_.map(list, e => e.id_proyecto.substring(0, 2)));
    if (busqueda_tipo_proyecto !== 'TODO') {
        list = _.pickBy(list, proyecto => proyecto.id_proyecto.substring(0, 2) === busqueda_tipo_proyecto)
    }
    if (busqueda_abierto !== 'TODO') {
        list = _.pickBy(list, proyecto => proyecto.mis_literales.filter(l => l.abierto === (busqueda_abierto === 'SI')).length > 0)
    }
    if (busqueda !== '') {
        list = _.pickBy(list, proyecto => {
                const contiene = texto => texto.toLowerCase().includes(busqueda.toLowerCase());
                const tiene_proyecto = contiene(proyecto.id_proyecto);
                const tiene_cotizacion = proyecto.cotizaciones.filter(c => contiene(c.orden_compra_nro) || contiene(`${c.unidad_negocio}-${c.nro_cotizacion}`)).length > 0;
                const tiene_literal = proyecto.mis_literales.filter(l => {
                    return contiene(l.descripcion) ||
                        contiene(l.id_literal) ||
                        l.cotizaciones.filter(c => contiene(c.orden_compra_nro) || contiene(`${c.unidad_negocio}-${c.nro_cotizacion}`)).length > 0
                }).length > 0;
                const tiene_cliente = proyecto.cliente_nombre && contiene(proyecto.cliente_nombre);
                return tiene_proyecto || tiene_cotizacion || tiene_literal || tiene_cliente
            }
        );
    }
    return (
        <div>
            <CotizacionAbrirCarpetaLista cargarDatosConsecutivoProyectos={cargarDatos}/>
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
                                onClick={() => setBusquedaTipoProyecto(o)}>
                                {o}
                            </span>
                        </div>)}
                        <div
                            className="col-1"
                            style={{backgroundColor: busqueda_tipo_proyecto === 'TODO' ? '#ff9800' : 'transparent'}}
                        >
                            <span
                                className='puntero'
                                onClick={() => setBusquedaTipoProyecto('TODO')}
                            >
                                TODO
                            </span>
                        </div>
                    </div>
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
                        <div className="col-2">Cliente</div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-7">Literal</div>
                                <div className="col-1">Activo</div>
                                <div className="col-2">Cot. Adi</div>
                                <div className="col-2">#OC</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 body">
                    {_.map(list, proyecto => <div className="row" key={proyecto.id}>
                        <div className="col-1">
                            <Link
                                target='_blank'
                                to={`/app/proyectos/proyectos/detail/${proyecto.id}`}>
                                {proyecto.id_proyecto}
                            </Link>
                        </div>
                        <div className="col-1">{proyecto.cotizaciones.map(cotizacion =>
                            <div className="row" key={cotizacion.id}>
                                <div className="col-12">
                                    <Link
                                        target='_blank'
                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion.id}`}>
                                        {cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}
                                    </Link>
                                </div>
                                <div className="col-12">
                                    {cotizacion.orden_compra_nro}
                                </div>
                            </div>)}</div>
                        <div className="col-2">{proyecto.cliente_nombre}</div>
                        <div className="col-8">
                            {proyecto.mis_literales.map(literal => <div className="row" key={literal.id}>
                                <div className="col-7">{literal.id_literal} - {literal.descripcion}</div>
                                <div className="col-1 text-center">{literal.abierto ?
                                    <FontAwesomeIcon icon={'check-circle'}/> : ''}</div>
                                {literal.cotizaciones &&
                                <div className="col-4">
                                    {literal.cotizaciones.map(cotizacion =>
                                        <div key={cotizacion.id} className='row'>
                                            <div className="col-6">
                                                <Link
                                                    target='_blank'
                                                    to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion.id}`}>
                                                    {cotizacion.unidad_negocio}-{cotizacion.nro_cotizacion}
                                                </Link>
                                            </div>
                                            <div className="col-6">{cotizacion.orden_compra_nro}</div>
                                        </div>)}
                                </div>}
                            </div>)}
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default ConsecutivoProyectoTabla;