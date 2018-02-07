import React, {Component} from 'react';
import {formatMoney} from 'accounting';

export default class TablaProyectosLiterales extends Component {
    renderItemTabla(item, onSelectItem) {
        const {item_seleccionado} = this.props;
        return (
            <tr key={item.id}
                className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
                style={{cursor: "pointer"}}
                onClick={() => {
                    onSelectItem(item)
                }}
            >
                <td>
                    {item.id_literal}
                </td>
                <td>
                    {formatMoney(Number(item.costo_materiales), "$", 0, ".", ",")}
                </td>
                <td>
                    {formatMoney(Number(item.costo_mano_obra), "$", 0, ".", ",")}
                </td>
                <td>
                    {formatMoney(Number(item.costo_mano_obra) + Number(item.costo_materiales), "$", 0, ".", ",")}
                </td>
            </tr>
        )
    }

    render() {
        const {lista_literales, onSelectItem} = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Proyecto</th>
                    <th>Costo Materiales</th>
                    <th>Costo MO</th>
                    <th>Costo Total</th>
                </tr>
                </thead>
                <tbody>
                {_.map(lista_literales, item => {
                    return this.renderItemTabla(item, onSelectItem)
                })}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        )
    }
}
