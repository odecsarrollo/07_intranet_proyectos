import React from 'react';
import PropTypes from "prop-types";
import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';
import {pesosColombianos} from '../../../../components/utilidades/forms/common';

const ItemTabla = (props) => {
    const {item, can_see_costo_item} = props;
    return (
        <tr>
            <td>{item.id_item}</td>
            <td>{item.descripcion}</td>
            <td>{item.descripcion_dos}</td>
            <td>{item.unidad_medida_inventario}</td>
            <td>{item.activo}</td>
            <td>{item.id_referencia}</td>
            <td>{item.nombre_tercero}</td>
            {can_see_costo_item && <td>{pesosColombianos(item.ultimo_costo)}</td>}
        </tr>
    )
};

ItemTabla.propTypes = {
    item: PropTypes.object,
    can_see_costo_item: PropTypes.bool
};

export const TablaItemsCGUNO = (props) => {
    const can_see_costo_item = tengoPermiso(props.mis_permisos, 'ultimo_costo_itemsbiable');
    return (
        <table className="table table-responsive table-striped tabla-maestra">
            <thead>
            <tr>
                <th>Id CGUNO</th>
                <th>Descripcion</th>
                <th>Descripcion Dos</th>
                <th>Unidad Medida</th>
                <th>Activo</th>
                <th>Referencia</th>
                <th>Proveedor</th>
                {can_see_costo_item && <th>Último Costo</th>}
            </tr>
            </thead>
            <tbody>
            {_.map(props.lista, item => {
                return <ItemTabla key={item.id_item} item={item} can_see_costo_item={can_see_costo_item}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};

TablaItemsCGUNO.propTypes = {
    lista: PropTypes.any.isRequired,
    mis_permisos: PropTypes.any.isRequired
};

export default TablaItemsCGUNO