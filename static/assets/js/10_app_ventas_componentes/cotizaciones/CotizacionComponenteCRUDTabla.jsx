import React, {memo} from "react";
import TablaBase from './CotizacionComponenteCrudTablaBase';

const TablaCotizacionesDashboard = memo(props => {
    const {
        singular_name,
        onDelete = null,
        permisos_object,
        estado_cotizacion_seleccionada,
        setEstadoCotizacion
    } = props;
    const estados = [
        {indice: 1, nombre: 'En Proceso', codigo: 'PRO'},
        {indice: 2, nombre: 'Enviada', codigo: 'ENV'},
        {indice: 3, nombre: 'Recibida', codigo: 'REC'},
        {indice: 4, nombre: 'Terminada', codigo: 'FIN'},
        {indice: 5, nombre: 'Rechazada', codigo: 'ELI'},
        {indice: 5, nombre: 'Aplazada', codigo: 'APL'},
    ];
    return (
        <div>
            <div>
                Filtro Estado:
                <div className="row">
                    {_.map(estados, e =>
                        <div
                            key={e.codigo} className="col-12 col-sm-6 col-md-3 col-lg-1 puntero"
                            onClick={() => setEstadoCotizacion(e.codigo)}
                            style={{color: `${e.codigo === estado_cotizacion_seleccionada ? 'red' : ''}`}}
                        >
                            {e.nombre}
                        </div>)}
                </div>
            </div>
            <TablaBase
                list={props.list}
                singular_name={singular_name}
                onDelete={onDelete}
                permisos_object={permisos_object}
            />
        </div>
    );
});

export default TablaCotizacionesDashboard;