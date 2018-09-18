import React, {Fragment} from 'react';
import {pesosColombianos} from '../../../../00_utilities/common';
import {ListaBusqueda} from '../../../../00_utilities/utiles';

const ItemTabla = (props) => {
    const {item, item: {item_biable}, can_see_ultimo_costo_item_biable} = props;
    return (
        <tr>
            <td>{item_biable.id_item}</td>
            <td>{item_biable.id_referencia}</td>
            <td>{item_biable.descripcion}</td>
            <td>{item.cantidad}</td>
            <td>{item_biable.unidad_medida_inventario}</td>
            {can_see_ultimo_costo_item_biable && <td>{pesosColombianos(item.costo_total)}</td>}
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            item.item_biable && (
                item.item_biable.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_referencia.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
            )
        )
    });
};

const TablaProyectosLiteralesMateriales = (props) => {
    const {
        items_literales,
        can_see_ultimo_costo_item_biable,
    } = props;
    return (
        <ListaBusqueda>
            {
                busqueda => {
                    const listado_materiales = buscarBusqueda(items_literales, busqueda);
                    return (
                        <table className="table table-responsive table-striped tabla-maestra">
                            <thead>
                            <tr>
                                <th>Id CGUNO</th>
                                <th>Referencia</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Unidad</th>
                                {can_see_ultimo_costo_item_biable && <th>Costo Total</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {_.map(listado_materiales, item => {
                                return <ItemTabla key={item.id} item={item} {...props}/>
                            })}
                            </tbody>
                            <tfoot>

                            </tfoot>
                        </table>
                    )
                }
            }
        </ListaBusqueda>
    )
};

export default TablaProyectosLiteralesMateriales;