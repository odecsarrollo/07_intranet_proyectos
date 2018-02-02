import React, {Component} from 'react';
import {formatMoney} from 'accounting';

export default class TablaProyectosLiteralesMateriales extends Component {
    renderItemTabla(item) {
        const {item_biable} = item;
        return (
            <tr key={item.id}>
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
                    {formatMoney(Number(item.costo_total), "$", 0, ".", ",")}
                </td>
            </tr>
        )
    }

    render() {
        const {lista_materiales} = this.props;
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
                    return this.renderItemTabla(item)
                })}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        )
    }
}
