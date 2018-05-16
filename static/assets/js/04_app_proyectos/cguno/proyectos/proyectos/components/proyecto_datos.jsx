import React, {Fragment} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../../../00_utilities/common";
import {Link} from 'react-router-dom'

const InfoProyecto = (props) => {
    const {proyecto, cotizaciones_permisos} = props;
    return (
        <div className="row">
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Proyecto: </strong><small>{proyecto.id_proyecto}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Cotizacion: </strong><small>
                    {
                        cotizaciones_permisos.detail ?
                            <Link to={`/app/proyectos/cotizaciones/cotizaciones/detail/${proyecto.cotizacion}`}>
                                {proyecto.cotizacion_nro}
                            </Link> :
                            <Fragment>{proyecto.cotizacion_nro}</Fragment>
                    }
                    </small></span>
            </div>
            <div className="col-12 col-md-6">
                <span><strong>Nombre: </strong><small>{proyecto.nombre}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                                <span><strong>Sincronizado: </strong>
                                    <i className={`fa fa-${proyecto.en_cguno ? 'check' : 'times'}`}>
                                    </i>
                                </span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Precio: </strong><small>{pesosColombianos(proyecto.valor_cliente)}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Costo Presupuestado: </strong><small>{pesosColombianos(proyecto.costo_presupuestado)}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Nro. Cotización: </strong><small>{proyecto.cotizacion_nro}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Nro. OC: </strong><small>{proyecto.orden_compra_nro}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                                <span><strong>Abierto: </strong>
                                    <i className={`fa fa-${proyecto.abierto ? 'check' : 'times'}`}></i>
                                </span>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-6">
                                        <span><strong>Fecha OC: </strong><small>
                                            {
                                                proyecto.orden_compra_fecha ? fechaFormatoUno(proyecto.orden_compra_fecha) : 'Sin Definir'
                                            }
                                            </small></span>
                    </div>
                    <div className="col-12 col-md-6">
                                        <span><strong>Fecha Pactada Entrega: </strong><small>
                                            {
                                                proyecto.fecha_entrega_pactada ? fechaFormatoUno(proyecto.fecha_entrega_pactada) : 'Sin Definir'
                                            }
                                        </small></span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default InfoProyecto;