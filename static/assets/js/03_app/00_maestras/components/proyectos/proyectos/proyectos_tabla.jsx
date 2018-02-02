import React, {Component} from 'react';
import {formatMoney} from 'accounting';

export default class TablaProyectos extends Component {
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
                    {item.id_proyecto}
                </td>
                <td>
                    {formatMoney(Number(item.costo_materiales), "$", 0, ".", ",")}
                </td>
                <td className='text-center'>
                    {item.abierto && <div><i className="fas fa-check"></i></div>}
                </td>
            </tr>
        )
    }

    render() {
        const {lista, onSelectItem} = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Proyecto</th>
                    <th>Costo Materiales</th>
                    <th>Abierto</th>
                </tr>
                </thead>
                <tbody>
                {_.map(lista, item => {
                    return this.renderItemTabla(item, onSelectItem)
                })}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        )
    }
}
