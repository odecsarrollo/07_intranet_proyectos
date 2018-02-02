import React, {Component} from 'react';
import {formatMoney} from 'accounting';
import {Link} from 'react-router-dom';

export default class TablaProyectos extends Component {
    renderItemTabla(item, onSelectItem) {
        const {item_seleccionado, can_change, can_see_details} = this.props;
        return (
            <tr key={item.id}
                className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
            >
                <td>
                    {item.id_proyecto}
                </td>
                <td>
                    {formatMoney(Number(item.costo_materiales), "$", 0, ".", ",")}
                </td>
                <td className='text-center'>
                    {item.abierto && <i className="fas fa-check"></i>}
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
                {
                    can_see_details &&
                    <td className='text-center'>
                        {item.mis_literales.length > 0 &&
                        <Link className="right" to={`/app/maestras/proyectos/proyectos/detail/${item.id}`}>
                            <i className="fas fa-plus"></i>
                        </Link>
                        }
                    </td>
                }
            </tr>
        )
    }

    render() {
        const {lista, onSelectItem, can_change, can_see_details} = this.props;
        return (
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Proyecto</th>
                    <th>Costo Materiales</th>
                    <th>Abierto</th>
                    {
                        can_change &&
                        <th>Editar</th>
                    }
                    {
                        can_see_details &&
                        <th>Ver Literales</th>
                    }
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
