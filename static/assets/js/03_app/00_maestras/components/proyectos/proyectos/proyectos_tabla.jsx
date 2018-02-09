import React from 'react';
import PropTypes from 'prop-types';
import {pesosColombianos} from '../../../../components/utilidades/forms/common';
import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';
import {Link} from 'react-router-dom';

const ItemTabla = (props) => {
    const {
        item_seleccionado,
        onSelectItem,
        item,
        mis_permisos
    } = props;
    const can_change = tengoPermiso(mis_permisos, 'change_proyecto');
    const can_see_costo_presupuestado = tengoPermiso(mis_permisos, 'costo_presupuestado_proyecto');
    const can_see_costo_materiales = tengoPermiso(mis_permisos, 'costo_materiales_proyecto');
    const can_see_valor = tengoPermiso(mis_permisos, 'valor_proyecto');
    const can_see_details = tengoPermiso(mis_permisos, 'detail_proyecto');
    return (
        <tr
            className={item_seleccionado && item_seleccionado.id === item.id ? 'tr-seleccionado' : ''}
        >
            <td>
                {item.id_proyecto}
            </td>

            {
                can_see_costo_presupuestado &&
                <td>
                    {pesosColombianos(item.costo_presupuestado)}
                </td>
            }
            {
                can_see_costo_materiales &&
                <td>
                    {pesosColombianos(item.costo_materiales)}
                </td>
            }
            <td>
                {pesosColombianos(item.costo_mano_obra)}
            </td>

            {
                can_see_valor &&
                <td>
                    {pesosColombianos(item.valor_cliente)}
                </td>
            }
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
};

ItemTabla.propTypes = {
    item: PropTypes.object,
    item_seleccionado: PropTypes.object,
    mis_permisos: PropTypes.any.isRequired,
    onSelectItem: PropTypes.func
};

const TablaProyectos = (props) => {
    const {
        lista,
        mis_permisos
    } = props;
    const can_change = tengoPermiso(mis_permisos, 'change_proyecto');
    const can_see_costo_presupuestado = tengoPermiso(mis_permisos, 'costo_presupuestado_proyecto');
    const can_see_costo_materiales = tengoPermiso(mis_permisos, 'costo_materiales_proyecto');
    const can_see_valor = tengoPermiso(mis_permisos, 'valor_proyecto');
    const can_see_details = tengoPermiso(mis_permisos, 'detail_proyecto');
    return (
        <table className="table table-responsive table-striped tabla-maestra">
            <thead>
            <tr>
                <th>Proyecto</th>
                {
                    can_see_costo_presupuestado &&
                    <th>Costo Presupuestado</th>
                }
                {
                    can_see_costo_materiales &&
                    <th>Costo Materiales</th>
                }
                <th>Costo MO</th>
                {
                    can_see_valor &&
                    <th>Precio</th>
                }
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
                return <ItemTabla key={item.id} item={item} {...props}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};

TablaProyectos.propTypes = {
    lista: PropTypes.any.isRequired,
    mis_permisos: PropTypes.any.isRequired
};

export default TablaProyectos