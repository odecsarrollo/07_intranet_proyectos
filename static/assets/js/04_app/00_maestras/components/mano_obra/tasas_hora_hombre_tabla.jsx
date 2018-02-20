import React from 'react';
import {pesosColombianos} from '../../../components/utilidades/common';


const ItemTabla = (props) => {
    const {
        item,
        item_seleccionado,
        onSelectItem,
        can_change
    } = props;
    return (
        <tr className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}>
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
                {pesosColombianos(item.costo_hora)}
            </td>
            {
                can_change &&
                <td className='text-center'>
                    {
                        item.colaborador_en_proyectos ?
                            <i className="fas fa-edit"
                               style={{cursor: "pointer"}}
                               onClick={() => {
                                   onSelectItem(item)
                               }}
                            >
                            </i>
                            : <span>Ya no esta en proyectos</span>
                    }
                </td>
            }
        </tr>
    )
};


const TablaTasasHorasHombres = (props) => {
    const {
        lista,
        can_change
    } = props;
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
            {_.map(_.sortBy(lista, ['ano', 'colaborador', 'mes']), item => {
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};

export default TablaTasasHorasHombres;
