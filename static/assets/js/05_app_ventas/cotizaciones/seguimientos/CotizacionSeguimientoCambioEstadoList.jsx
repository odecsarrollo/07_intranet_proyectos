import React, {memo} from 'react';
import {fechaHoraFormatoUno} from "../../../00_utilities/common";

const Estado = memo(props => {
    const {estado} = props;
    return (
        <li className="list-group-item">
            <span>{estado.estado} </span>
            <small>{fechaHoraFormatoUno(estado.created)} por {estado.creado_por_username}</small>
        </li>
    )
});

const CambioEstadoList = memo(props => {
    const {seguimiento_list} = props;
    const cambios_estados_array = _.map(_.orderBy(_.pickBy(seguimiento_list, s => s.tipo_seguimiento === 1), ['id'], ['desc']));
    return (
        <div className="col-xs-12">
            <div className="page-header">
                <h1>Historial de cambios de estado</h1>
            </div>
            <ul className="list-group">
                {cambios_estados_array.map(estado => <Estado key={estado.id} estado={estado}/>)}
            </ul>

        </div>
    )
});
export default CambioEstadoList;