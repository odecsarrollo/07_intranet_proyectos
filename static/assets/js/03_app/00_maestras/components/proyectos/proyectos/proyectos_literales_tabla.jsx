import React from 'react';
import {pesosColombianos} from '../../../../components/utilidades/common';

const ItemTabla = (props) => {
    const {item_seleccionado, onSelectItem, item} = props;
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
            <td>
                {pesosColombianos(item.costo_materiales)}
            </td>
            <td>
                {pesosColombianos(item.costo_mano_obra)}
            </td>
            <td>
                {pesosColombianos(Number(item.costo_mano_obra) + Number(item.costo_materiales))}
            </td>
        </tr>
    )
};


const TablaProyectosLiterales = (props) => {
    const {lista_literales, proyecto} = props;
    console.log(proyecto)
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
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                <td>{pesosColombianos(proyecto.costo_materiales)}</td>
                <td>{pesosColombianos(proyecto.costo_mano_obra)}</td>
                <td>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_materiales))}</td>
            </tr>
            </tfoot>
        </table>
    )
};

export default TablaProyectosLiterales;