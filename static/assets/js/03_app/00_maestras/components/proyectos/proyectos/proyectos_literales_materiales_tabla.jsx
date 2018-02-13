import React from 'react';
import {pesosColombianos} from '../../../../components/utilidades/common';

const ItemTabla = (props) => {
    const {item, item: {item_biable}} = props;
    return (
        <tr>
            <td>
                {item_biable.id_item}
            </td>
            <td>
                {item_biable.id_referencia}
            </td>
            <td>
                {item_biable.descripcion}
            </td>
            <td>
                {item.cantidad}
            </td>
            <td>
                {item_biable.unidad_medida_inventario}
            </td>
            <td>
                {pesosColombianos(item.costo_total)}
            </td>
        </tr>
    )
};

const TablaProyectosLiteralesMateriales = (props) => {
    const {lista_materiales} = props;
    return (
        <table className="table table-responsive table-striped tabla-maestra">
            <thead>
            <tr>
                <th>Id CGUNO</th>
                <th>Referencia</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Costo Total</th>
            </tr>
            </thead>
            <tbody>
            {_.map(lista_materiales, item => {
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};

export default TablaProyectosLiteralesMateriales;