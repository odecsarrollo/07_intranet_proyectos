import React, {Component} from 'react';
import {formatMoney} from 'accounting';
import {Link} from 'react-router-dom';
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

export default class TablaHojasTrabajosDiarios extends Component {
    renderItemTabla(item, onSelectItem) {
        const {
            item_seleccionado,
            can_change,
            can_see_details,
            can_see_costos
        } = this.props;
        return (
            <tr key={item.id}
                className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
            >
                <td>
                    {item.colaborador_nombre}
                </td>
                <td>
                    {moment.tz(item.fecha, "America/Bogota").format('MMMM D [de] YYYY')}
                </td>
                <td>
                    {Number(item.cantidad_minutos / 60).toFixed(2)} Horas
                </td>
                {
                    can_see_costos &&
                    <td>
                        {formatMoney(Number(item.tasa_valor), "$", 0, ".", ",")}
                    </td>
                }
                {
                    can_see_costos &&
                    <td>
                        {formatMoney(Number(item.costo_total), "$", 0, ".", ",")}
                    </td>
                }
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
                {
                    can_see_details &&
                    <td className='text-center'>
                        <Link className="right" to={`/app/mano_obra/hojas_trabajo/detail/${item.id}`}>
                            <i className="fas fa-eye"></i>
                        </Link>
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
            can_see_details,
            can_see_costos
        } = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Colaborador</th>
                    <th>Fecha</th>
                    <th>Horas</th>
                    {
                        can_see_costos &&
                        <th>Costo Hora</th>
                    }
                    {
                        can_see_costos &&
                        <th>Costo Total</th>
                    }
                    {
                        can_change &&
                        <th>Editar</th>
                    }
                    {
                        can_see_details &&
                        <th>Ver</th>
                    }
                </tr>
                </thead>
                <tbody>
                {_.map(_.sortBy(lista, ['fecha', 'colaborador_nombre']), item => {
                    return this.renderItemTabla(item, onSelectItem)
                })}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        )
    }
}
