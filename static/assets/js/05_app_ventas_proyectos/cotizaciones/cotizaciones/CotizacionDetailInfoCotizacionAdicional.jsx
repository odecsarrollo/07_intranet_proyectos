import React from 'react';
import {Link} from "react-router-dom";

const CotizacionDetailInfoCotizacionAdicional = (props) => {
    const {cotizacion: {cotizaciones_adicionales}} = props;
    return (
        <div style={{
            borderRadius: '5px',
            border: 'solid black 1px',
            padding: '5px',
            marginBottom: '10px'
        }}>
            <strong>Cotizaciones Adicionales: </strong>
            <div className="col-12">
                {cotizaciones_adicionales.length > 0 && <div className='row'>
                    {_.orderBy(cotizaciones_adicionales, ['nro_cotizacion', 'asc']).map(c => <div
                        key={c.id}
                        style={{position: 'relative'}}
                        className='col-6 col-sm-4 col-md-3'
                    >
                        <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                            {c.unidad_negocio}-{c.estado === 'Cierre (Aprobado)' ? c.nro_cotizacion : c.estado}
                        </Link>
                    </div>)}
                </div>}
            </div>
        </div>
    )
};

export default CotizacionDetailInfoCotizacionAdicional;