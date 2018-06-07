import React, {Fragment} from 'react';
import {pesosColombianos, fechaFormatoUno} from "../../../../00_utilities/common";
import {Link} from 'react-router-dom'

const CotizacionInfo = (props) => {
    const {object, permisos_proyecto} = props;
    return (
        <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
                <strong>Unidad Negocio: </strong> {object.unidad_negocio}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <strong>Cliente: </strong> {object.cliente}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
                <strong>Contacto: </strong> {object.contacto}
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <strong>Fecha Entrega
                            Cotización: </strong>{object.fecha_entrega_pactada_cotizacion ? fechaFormatoUno(object.fecha_entrega_pactada_cotizacion) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Valor Orden Compra: </strong>{pesosColombianos(object.valor_orden_compra)}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Nro Orden Compra: </strong>{object.orden_compra_nro}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Fecha Orden
                            Compra: </strong>{object.orden_compra_fecha ? fechaFormatoUno(object.orden_compra_fecha) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Valor Ofertado: </strong>{pesosColombianos(object.valor_ofertado)}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Costo Presupuestado: </strong>{pesosColombianos(object.costo_presupuestado)}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Fecha Entrega
                            Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
                    </div>
                </div>
            </div>
            <div className="col-12 mt-3">
                <strong>Descripción: </strong> {object.descripcion_cotizacion}<br/>
                <strong>Observación: </strong> {object.observacion}<br/>
                <strong>Estado: </strong> {object.estado} <br/>
                <strong>Proyecto: </strong>
                {
                    permisos_proyecto.detail ?
                        <Fragment>
                            {
                                object.mi_proyecto ?
                                    <Link
                                        to={`/app/proyectos/proyectos/detail/${object.mi_proyecto}`}>{object.id_proyecto}
                                    </Link> :
                                    <Link
                                        to={`/app/proyectos/proyectos/detail/${object.mi_literal_proyecto_id}`}>{object.mi_literal_id_literal}
                                    </Link>
                            }
                        </Fragment>
                        :
                        <span>{object.id_proyecto}</span>
                }
                <br/>
                {object.responsable &&
                <Fragment><strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                    <br/></Fragment>}
            </div>
        </div>
    )
};

export default CotizacionInfo;