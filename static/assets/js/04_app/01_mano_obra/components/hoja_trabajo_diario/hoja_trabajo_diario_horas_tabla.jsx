import React from 'react';
import {pesosColombianos} from '../../../components/utilidades/common';


const ItemTabla = (props) => {
    const {
        item,
        item_seleccionado,
        onSelectItem,
        can_change,
        tasa_valor,
        can_see_costos
    } = props;
    return (
        <tr
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
                <td>{pesosColombianos(tasa_valor)}</td>
            }
            {
                can_see_costos &&
                <td>{pesosColombianos(tasa_valor * (item.cantidad_minutos / 60))}</td>

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
};

const TablaHorasHojaTrabajo = (props) => {
    const {
        lista,
        can_change,
        total_minutos,
        costo_total,
        can_see_costos
    } = props;
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
                return <ItemTabla key={item.id} item={item} {...props}/>
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
                    <td>{pesosColombianos(costo_total)}</td>
                }
            </tr>
            </tfoot>
        </table>
    )
};

export default TablaHorasHojaTrabajo;
