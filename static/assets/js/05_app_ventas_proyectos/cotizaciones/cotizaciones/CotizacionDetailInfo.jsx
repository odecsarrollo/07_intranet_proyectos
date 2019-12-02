import React, {Fragment, memo} from 'react';
import {fechaFormatoUno} from "../../../00_utilities/common";
import {Link} from 'react-router-dom'
import CotizacionDetailInfoValoresTable from './CotizacionDetailInfoValoresTable';
import CotizacionDetailInfoLiteral from './CotizacionDetailInfoLiteral';
import CotizacionDetailInfoProyecto from './CotizacionDetailInfoProyecto';
import CotizacionDetailInfoCotizacionAdicional from './CotizacionDetailInfoCotizacionAdicional';

const CotizacionInfo = memo(props => {
    const {object, object: {estado}, permisos_cotizacion} = props;
    const {cotizacion_inicial} = object;
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
                        <strong>Fecha Inicio
                            Proyecto: </strong>{object.condiciones_inicio_fecha_ultima ? fechaFormatoUno(object.condiciones_inicio_fecha_ultima) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Días Pactados Entrega Proyecto: </strong>{object.dias_pactados_entrega_proyecto}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Entrega
                            Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
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
            {estado === 'Cierre (Aprobado)' &&
            <Fragment>
                {object.es_adicional &&
                <div className="col-12 col-lg-5">
                    <CotizacionDetailInfoLiteral cotizacion={object} permisos_cotizacion={permisos_cotizacion}/>
                </div>}

                {!object.es_adicional &&
                <Fragment>
                    <div className="col-12 col-lg-4">
                        <CotizacionDetailInfoProyecto cotizacion={object} permisos_cotizacion={permisos_cotizacion}/>
                    </div>
                    <div className="col-12 col-lg-5">
                        <CotizacionDetailInfoCotizacionAdicional cotizacion={object}/>
                    </div>
                </Fragment>}
            </Fragment>}

            {object.responsable_nombres &&
            <div className='col-12'>
                <strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                <br/></div>}

            {object.observacion &&
            <div className='col-12'><strong>Observación: </strong> {object.observacion}</div>}
        </div>
    )
});

export default CotizacionInfo;