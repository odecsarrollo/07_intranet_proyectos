import React from 'react';
import {pesosColombianos} from '../../../../../00_utilities/common';

const ItemTabla = (props) => {
    const {
        item_seleccionado,
        onSelectItem,
        item,
        can_see_costo_mano_obra,
        can_see_costo_materiales,
        can_see_costo_total
    } = props;
    return (
        <tr className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
            style={{cursor: "pointer"}}
            onClick={() => {
                onSelectItem(item)
            }}
        >
            <td>
                {item.id_literal}
            </td>
            {can_see_costo_materiales &&
            <td>
                {pesosColombianos(item.costo_materiales)}
            </td>
            }
            {can_see_costo_mano_obra &&
            <td>
                {pesosColombianos(item.costo_mano_obra)}
            </td>
            }
            {can_see_costo_total &&
            <td>
                {pesosColombianos(Number(item.costo_mano_obra) + Number(item.costo_materiales))}
            </td>
            }
        </tr>
    )
};


const TablaProyectosLiterales = (props) => {
    const {
        lista_literales,
        proyecto,
        can_see_costo_mano_obra,
        can_see_costo_materiales,
        can_see_costo_total
    } = props;
    return (
        <table className="table table-responsive table-striped tabla-maestra">
            <thead>
            <tr>
                <th>Proyecto</th>
                {can_see_costo_materiales && <th>Costo Materiales</th>}
                {can_see_costo_mano_obra && <th>Costo MO</th>}
                {can_see_costo_total && <th>Costo Total</th>}
            </tr>
            </thead>
            <tbody>
            {_.map(lista_literales, item => {
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                {can_see_costo_materiales && <td>{pesosColombianos(proyecto.costo_materiales)}</td>}
                {can_see_costo_mano_obra && <td>{pesosColombianos(proyecto.costo_mano_obra)}</td>}
                {can_see_costo_total &&
                <td>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_materiales))}</td>}
            </tr>
            </tfoot>
        </table>
    )
};

export default TablaProyectosLiterales;