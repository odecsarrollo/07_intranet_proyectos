import React, {Component} from 'react';
import {formatMoney} from 'accounting';
import {Link} from 'react-router-dom';

export default class TablaTasasHorasHombres extends Component {
    renderItemTabla(item, onSelectItem) {
        const {
            item_seleccionado,
            can_change
        } = this.props;
        return (
            <tr key={item.id}
                className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
            >
                <td>
                    {item.colaborador_nombre}
                </td>
                <td>
                    {item.ano}
                </td>
                <td>
                    {item.mes}
                </td>
                <td>
                    {formatMoney(Number(item.costo_hora), "$", 0, ".", ",")}
                </td>
                {
                    can_change &&
                    <td className='text-center'>
                        <i className="fas fa-edit"
                           style={{cursor: "pointer"}}
                           onClick={() => {
                               onSelectItem(item)
                           }}
                        ></i>
                    </td>
                }
            </tr>
        )
    }

    render() {
        const {
            lista,
            onSelectItem,
            can_change
        } = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Colaborador</th>
                    <th>Año</th>
                    <th>Mes</th>
                    <th>Costo Hora</th>
                    {
                        can_change &&
                        <th>Editar</th>
                    }
                </tr>
                </thead>
                <tbody>
                {_.map(_.sortBy(lista, ['ano','colaborador', 'mes']), item => {
                    return this.renderItemTabla(item, onSelectItem)
                })}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        )
    }
}
