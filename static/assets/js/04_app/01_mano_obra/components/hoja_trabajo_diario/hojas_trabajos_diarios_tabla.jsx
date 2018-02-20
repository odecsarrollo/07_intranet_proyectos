import React from 'react';
import {pesosColombianos, fechaFormatoUno} from '../../../components/utilidades/common';
import {Link} from 'react-router-dom';

const ItemTabla = (props) => {
    const {
        item_seleccionado,
        can_change,
        can_see_details,
        can_see_costos,
        item,
        onSelectItem
    } = props;
    return (
        <tr className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}>
            <td>
                {item.colaborador_nombre}
            </td>
            <td>
                {fechaFormatoUno(item.fecha)}
            </td>
            <td>
                {Number(item.cantidad_minutos / 60).toFixed(2)} Horas
            </td>
            {
                can_see_costos &&
                <td>
                    {pesosColombianos(item.tasa_valor)}
                </td>
            }
            {
                can_see_costos &&
                <td>
                    {pesosColombianos(item.costo_total)}
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
                    >
                    </i>
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
};


const TablaHojasTrabajosDiarios = (props) => {
    const {
        lista,
        can_change,
        can_see_details,
        can_see_costos
    } = props;
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
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};
export default TablaHojasTrabajosDiarios;
