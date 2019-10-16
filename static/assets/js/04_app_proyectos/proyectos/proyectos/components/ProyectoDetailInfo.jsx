import React, {Fragment} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const InfoProyecto = (props) => {
    const {proyecto, proyecto: {cotizaciones}, cotizaciones_permisos, cotizaciones_proyecto_list} = props;
    let cotizaciones_proyecto = cotizaciones.map(c => ({
        tipo: 1,
        id: c.id,
        codigo: `${c.unidad_negocio}-${c.nro_cotizacion}`,
        estado: c.estado
    }));
    cotizaciones.map(c => c.cotizaciones_adicionales.filter(e => e.estado === 'Cierre (Aprobado)').map(a => {
        cotizaciones_proyecto = [...cotizaciones_proyecto, {
            tipo: 2,
            id: a.id,
            codigo: `${a.unidad_negocio}-${a.nro_cotizacion}`,
            estado: a.estado
        }]
    }));
    console.log(cotizaciones_proyecto)
    cotizaciones_proyecto = _.orderBy(cotizaciones_proyecto, ['tipo'], ['asc']);
    return (
        <Fragment>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Proyecto: </strong><small>{proyecto.id_proyecto}</small></span>
            </div>
            <div className="col-12 col-md-6">
                <span><strong>Nombre: </strong><small>{proyecto.nombre}</small></span>
            </div>
            {cotizaciones_proyecto.length > 0 &&
            <div
                className="col-12"
            >
                <strong>Cotizaciones Relacionadas: </strong>
                <div className="row pl-2">
                    {cotizaciones_proyecto.map(coti =>
                        <div className='col-6 col-md-3' key={coti.id}>
                            <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${coti.id}`}
                                  target="_blank">
                                {coti.codigo}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            }

            <div className="col-12 col-md-6 col-lg-3">
                    <span><strong>Sincronizado: </strong>
                        <FontAwesomeIcon
                            icon={proyecto.en_cguno ? 'check' : 'times'}
                        />
                    </span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Precio: </strong><small>{pesosColombianos(proyecto.valor_cliente)}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Costo Presupuestado: </strong><small>{pesosColombianos(proyecto.costo_presupuestado)}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <span><strong>Nro. OC: </strong><small>{proyecto.orden_compra_nro}</small></span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                                <span><strong>Abierto: </strong>
                                    <FontAwesomeIcon
                                        icon={proyecto.abierto ? 'check' : 'times'}
                                    />
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
            {
                cotizaciones_proyecto_list.length > 0 &&
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <span><strong>Cotizacion: </strong><small>
                                {_.orderBy(cotizaciones_proyecto_list, ['tipo'], ['desc']).map(e => {
                                    return (
                                        <Fragment key={e.cotizacion}>
                                            {cotizaciones_permisos.detail ?
                                                <span>[<Link
                                                    to={`/app/ventas/cotizaciones/cotizaciones/detail/${e.cotizacion}`}>
                                                {e.cotizacion_nro}
                                            </Link>({e.tipo})] </span> :
                                                <span>[{e.cotizacion_nro}({e.tipo})] </span>
                                            }
                                        </Fragment>
                                    )
                                })}
                    </small></span>
                        </div>
                    </div>
                </div>
            }

        </Fragment>
    )
};

export default InfoProyecto;