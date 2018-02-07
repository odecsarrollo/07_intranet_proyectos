import React, {Component} from 'react';
import {formatMoney} from 'accounting';

export default class TablaHorasHojaTrabajo extends Component {
    renderItemTabla(item, onSelectItem) {
        const {
            item_seleccionado,
            can_change,
            tasa_valor,
            can_see_costos
        } = this.props;
        return (
            <tr key={item.id}
                className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
            >
                <td>
                    {item.literal_nombre}
                </td>
                <td>
                    {item.literal_descripcion}
                </td>
                <td>
                    {item.cantidad_minutos} Minutos
                </td>
                <td>
                    {(item.cantidad_minutos / 60).toFixed(2)} Horas
                </td>
                {
                    can_see_costos &&
                    <td>{formatMoney(Number(tasa_valor), "$", 0, ".", ",")}</td>
                }
                {
                    can_see_costos &&
                    <td>{formatMoney(Number(tasa_valor * (item.cantidad_minutos / 60)), "$", 0, ".", ",")}</td>

                }
                {
                    can_change &&
                    <td className='text-center'>
                        {
                            item.literal_abierto ?
                                <i className="fas fa-edit"
                                   style={{cursor: "pointer"}}
                                   onClick={() => {
                                       onSelectItem(item)
                                   }}
                                ></i> :
                                <div>Proyecto Inactivo</div>
                        }
                    </td>

                }
            </tr>
        )
    }

    render() {
        const {
            lista,
            onSelectItem,
            can_change,
            total_minutos,
            costo_total,
            can_see_costos
        } = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Proyecto</th>
                    <th>Descripción</th>
                    <th>En Minutos</th>
                    <th>En Horas</th>
                    {
                        can_see_costos &&
                        <th>Tasa</th>
                    }
                    {
                        can_see_costos &&
                        <th>Costo</th>
                    }
                    {
                        can_change &&
                        <th>Editar</th>
                    }
                </tr>
                </thead>
                <tbody>
                {_.map(lista, item => {
                    return this.renderItemTabla(item, onSelectItem)
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td>Total:</td>
                    <td></td>
                    <td>{total_minutos} Minutos</td>
                    <td>{(total_minutos / 60).toFixed(2)} Horas</td>
                    {
                        can_see_costos &&
                        <td></td>
                    }
                    {
                        can_see_costos &&
                        <td>{formatMoney(Number(costo_total), "$", 0, ".", ",")}</td>
                    }
                </tr>
                </tfoot>
            </table>
        )
    }
}
